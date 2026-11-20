// Never Twice the Same: offline cache for the app page.
// The app page (index.html) and the fonts are cached. Icons, images and every other file go straight to the network
// and are never replaced by the page, so a missing icon can no longer come back as HTML.
// The cache name changed in 2.22.1 (fonts added), so the old cache is cleared on the next load.
// The app page opens from the cache straight away, so a launch with no signal does not wait on the network.
// The network copy is fetched in the background and saved for the next launch.
const CACHE = 'ntts-shell-4';
const SHELL = ['./', 'index.html'];
const FONTS = ['cormorant-garamond-v21-latin-regular.woff2','cormorant-garamond-v21-latin-500.woff2','cormorant-garamond-v21-latin-600.woff2','cormorant-garamond-v21-latin-500italic.woff2','varta-v25-latin-regular.woff2','varta-v25-latin-500.woff2','varta-v25-latin-600.woff2'].map(function (f) { return 'fonts/' + f; });

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL.map(function (u) { return new Request(u, { cache: 'reload' }); })); }).then(function () { return caches.open(CACHE).then(function (c) { return Promise.all(FONTS.map(function (u) { return c.add(u).catch(function () {}); })); }); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request, u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== self.location.origin) return;
  // Fonts: answer from the cache first, then the network. They never change under the same name.
  if (u.pathname.indexOf('/fonts/') > -1) {
    e.respondWith(caches.match(req).then(function (m) {
      return m || fetch(req).then(function (r) { if (r && r.ok) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); }); } return r; });
    }));
    return;
  }
  // The update check always goes to the network so new versions are seen.
  if (u.pathname.endsWith('/version.json')) return;
  // Only the app page is handled here. Anything else (icons, images, other files) is not touched.
  var isPage = req.mode === 'navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('.html');
  if (!isPage) return;
  // Start the network copy now. It refreshes the cached page for the next launch.
  // cache: 'no-cache' asks the server to confirm the copy, so the phone never reuses an old HTTP-cached page.
  var net = fetch(new Request(req, { cache: 'no-cache' })).then(function (r) {
    if (r && r.ok) {
      return caches.open(CACHE).then(function (c) { return c.put('index.html', r.clone()); }).then(function () { return r; });
    }
    return r;
  });
  e.waitUntil(net.catch(function () {}));
  // Answer from the cached page at once. Fall back to the network only if nothing is cached yet.
  e.respondWith(
    caches.match('index.html').then(function (m) {
      return m || net.catch(function () { return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } }); });
    })
  );
});

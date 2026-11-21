# Never Twice the Same

A personal catalog for an antique and vintage jewelry collection. It's a single web page with no server, accounts, or build step. Add it to an iPhone Home Screen.

Live site: https://nevertwicethesame.github.io/jewelrybox/

## Features

- **Catalog:** record each piece's details, photos, and status.
- **Gallery:** shared reference photos, linked to pieces as references, comparables, or covers.
- **Collections:** group pieces around a theme, such as Victorian mourning rings, and order them your way.
- **Coveted Pieces:** wanted items with a photo, a link, and a type.
- **Secret Compartment:** a keyword-protected view that hides pieces above a dollar amount, everywhere in the app. It is a privacy screen, not encryption: hidden pieces are still in the app's data and in backups.
- **Jewelry of the Day:** a random pick for a ring, earrings, and a necklace, weighted toward pieces not worn recently.
- **Wares and Dashboard:** what's for sale and what has sold, with gold and silver prices and charts.
- **Guides:** ring, earring, and necklace size guides, and a timeline of jewelry periods.
- **Themes:** four color themes, light and dark.
- **Import and export:** CSV for spreadsheets, and JSON for full backups.
- **Reminders:** a backup banner when the last JSON backup is over 7 days old, and an update notice when a newer version is published.

## Install on iPhone

1. Open the live site in Safari.
2. Tap Share, then **Add to Home Screen**.
3. Always open the app from that Home Screen icon. Data stays on that device.

## Your data

Everything is stored on your device in the browser's IndexedDB. Nothing is uploaded.

iOS can clear browser storage, so keep regular JSON backups:

1. Open the menu, tap **I/O**, then choose **Export JSON**.
2. Save every file it produces to Files or iCloud Drive.

To restore, open the menu, tap **I/O**, and choose **Import JSON**. Select **all** the files from the same export at once. Restoring replaces the data on the device after you confirm. If a file is missing, the app warns you first.

## Privacy

- No accounts, analytics, cookies, or tracking.
- Your collection, photos, and wishlist stay on your device. The app's event log stays there too, with counts but no piece titles.
- Fonts are served from this site, not from Google or anyone else.
- The app asks this site for two small files: `version.json` (update check) and `prices.json` (gold and silver prices). Nothing about you or your collection is sent.
- The Coveted preview window loads the page you link to. That page belongs to the other site, and the app does not send a referrer.
- JSON backups are not encrypted and contain costs, sellers, and notes. Store them somewhere private. Never commit one to this repository.
- Like any website, GitHub Pages may log visitor IP addresses. That is GitHub's doing and not something the app controls.

## Prices

Gold and silver spot and melt prices are fetched once a day by a GitHub Action (`.github/workflows/prices.yml`, script `scripts/fetch-prices.mjs`), which saves them to `prices.json`. The API key is a GitHub Actions secret and is not in any file. Prices come from [MetalCharts](https://metalcharts.org) and are indicative only: estimates, not an appraisal or financial advice.

## Accessibility

The goal is WCAG 2.2 level AA as far as is practical for a personal app. Text meets contrast minimums in every theme, icon-only buttons are labeled, pinch zoom is on, and the heart animation is skipped when iOS Reduce Motion is on. Known gaps are tracked in the project's design notes.

## Credits and licenses

- Fonts: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) and [Varta](https://fonts.google.com/specimen/Varta), both under the SIL Open Font License 1.1. License text is in the `fonts` folder.
- Illustrations and icons are original to this project.
- Photos, quotes, and links in Coveted Pieces and the Gallery belong to their owners and are for private reference only.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app in one file. |
| `version.json` | The current version. The app reads it for the update notice. |
| `prices.json` | Daily gold and silver prices, written by the GitHub Action. |
| `sw.js` | The service worker, which keeps the app working offline. |
| `fonts/` | The self-hosted fonts and their license files. |
| `apple-touch-icon.png` | The Home Screen icon. |
| `.github/workflows/prices.yml`, `scripts/fetch-prices.mjs` | The daily price update. |
| `README.md` | This file. |

## Development

- No build step. Edit `index.html` and publish it.
- Before publishing, check the script with `node --check`.
- Set the version in `APP_VERSION` in `index.html`, and make `version.json` match it.

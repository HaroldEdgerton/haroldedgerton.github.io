# Edgerton House Static Site

This folder is the static website output for Edgerton House.

## How to update

- Edit page HTML directly under the relevant folder, for example `resources/reservations/index.html`.
- Shared visual styles live in `assets/css/main.css`.
- Shared browser behavior lives in `assets/js/main.js`.
- Content uploads copied from the legacy site live in `assets/uploads/`.
- Old WordPress page URLs are represented by redirect pages under `index.php/`.
- Search uses the generated `search-index.json`; rebuild with `node tools/build-site.mjs` after changing generated content.

## Reservation notes

The lounge and BBQ reservation page intentionally keeps the old reservation policy PDF linked, but flags it as outdated. The obsolete MIT Event Registration Form PDF is not linked from the new reservation flow and is removed from the generated public assets.

The reservation form posts directly to Formspree endpoint `https://formspree.io/f/xgodgkaa`. Configure that Formspree form to notify `eha-reservations@mit.edu` and keep the mailing-list membership current as officers rotate.

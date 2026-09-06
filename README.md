# Buenos Aires & Uruguay — trip app

A static, single-page itinerary for a 4-day Buenos Aires trip (28 Nov – 2 Dec)
with a day in Colonia del Sacramento, Uruguay. Plain HTML, CSS and JavaScript.
No build step. Choices, checklists and to-dos persist in the browser's
`localStorage`.

## Run locally

Any static file server works. For example:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

## Deploy to GitHub Pages

The site uses only relative paths and hash routing (`#/itinerary`), so it works
at any base path, including a project site at `https://<user>.github.io/<repo>/`.

1. Create a GitHub repository and push this folder to its `main` branch.
2. In the repository, open **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` deploys on every push to
   `main`. The first run publishes the site at
   `https://<user>.github.io/<repo>/`.

If you prefer not to use Actions, set Source to **Deploy from a branch**,
pick `main` and `/ (root)`. The `.nojekyll` file is already present so Pages
serves the files as-is.

## Structure

```
index.html            shell, nav, footer
css/tokens.css        design tokens (see DESIGN.md)
css/app.css           components and layout
js/data.js            all trip content, links and prices
js/app.js             router, views, interactive components, storage
assets/img/           photographs (Wikimedia Commons, credited in the footer)
assets/img/credits.json
.github/workflows/    Pages deployment
```

## Editing content

Everything the traveler reads lives in `js/data.js`: itinerary stops, the
three decision points, restaurants, neighbourhood guides, the booking
checklist and the to-do seed list. Edit there; the views render from it.

## Storage

State lives under one `localStorage` key, `ba-trip:v1`. Clearing site data
for the page resets every choice and checklist.

## Link verification

Booking URLs were checked on 6 September 2026. Two notes from that check:

- Seacat's site resolves at `seacatcolonia.com.ar` (the `.com` domain in the
  brief does not resolve), so the app links to the `.com.ar` address.
- Viator and GetYourGuide block automated requests, so they were not
  machine-verified. Both are linked by search page rather than deep link.

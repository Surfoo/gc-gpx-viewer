# Geocaching GPX Viewer

Modern web app to visualize geocaching GPX files: load a GPX from disk or URL, see caches on an OpenLayers map with detailed info, geolocation, and free basemaps.

## Features
- Import GPX from your computer or a public URL.
- Cache markers styled by type/found status, detail popup (code, owner, D/T, container, description).
- Basemap choices (OSM Standard, OSM Humanitarian, Carto Voyager).
- Geolocation, refit to data, clear map.
- Responsive UI (desktop, tablet, mobile).
- Language selector (EN/FR/DE/ES/IT).

## Prerequisites
- Node.js 18+ recommended.

## Installation
```bash
npm install
```

## Scripts
- `npm run dev` – start Vite dev server (HMR).
- `npm run build` – production bundle to `dist/`.
- `npm run preview` – serve the built bundle locally.
- `npm run lint` – format/lint via Biome.

## Usage
1. `npm run dev`, then open the Vite URL.
2. Load a GPX:
   - File: “Depuis ton ordinateur” button (multiple allowed).
   - URL: paste a public GPX URL, click “Charger l'URL”.
3. Options: choose a basemap, click “Recentrer sur les caches” or use the locate control on the map.
4. Example: `public/gpx/example.gpx` is provided for testing.

## Structure
- `public/index.html` – app shell and static assets.
- `public/gpx/` – sample GPX (do not place sensitive data).
- `src/main.ts` – OpenLayers/GPX logic.
- `src/style.css` – styles and theme.

## Deployment
- Build with `npm run build`; serve `dist/` as a static site.

## Contributing
See `AGENTS.md` for conventions, commands, and PR expectations.

## License
Apache 2.0.

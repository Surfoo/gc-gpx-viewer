# Geocaching GPX Viewer

Modern web app to visualize geocaching GPX files: load a GPX from disk or URL, see caches on an OpenLayers map with detailed info, geolocation, and free basemaps.

## Features
- Import GPX from your computer or a public URL.
- Cache markers styled by type/found status, detail popup (code, owner, D/T, container, description).
- Basemap choices (OSM Standard, OSM Humanitarian, Carto Voyager, CyclOSM, Stamen Terrain).
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
- `npm run build` – production bundle to `public/`.
- `npm run preview` – serve the built bundle locally.
- `npm run lint` – format/lint via Biome.

## Usage
1. `npm run dev`, then open the Vite URL at `/gpxviewer/` (e.g., http://localhost:5173/gpxviewer/).
2. Load a GPX:
   - File: “Depuis ton ordinateur” button (multiple allowed).
   - URL: paste a public GPX URL, click “Charger l'URL”.
3. Options: choose a basemap, click “Recentrer sur les caches” or use the locate control on the map.
4. You can add your own GPX files locally and load them via file picker or URL.

## Structure
- `app/index.html` – app shell for Vite (dev + build entry).
- `static/` – public assets copied as-is (favicons, manifest, map icons).
- `src/main.ts` – OpenLayers/GPX logic.
- `src/style.css` – styles and theme.

## Deployment
- Build with `npm run build`; serve `public/` as a static site.

## Contributing
See `AGENTS.md` for conventions, commands, and PR expectations.

## License
Apache 2.0.

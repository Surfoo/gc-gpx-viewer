# Repository Guidelines

## Project Structure & Module Organization
- `public/` hosts the app shell (`index.html`) and static assets; `public/gpx/example.gpx` is a sample file for manual tests.
- `src/` holds TypeScript logic (`main.ts`) and styling (`style.css`) consumed by Vite.
- `package.json`, `vite.config.ts`, `tsconfig.json`, and `biome.json` define tooling.
- Legacy Parcel/Gulp assets were removed; keep new static assets in `public/` only.

## Build, Test, and Development Commands
- `npm install` – install dependencies (Vite, TypeScript, OpenLayers, Biome).
- `npm run dev` – launch Vite dev server; `public/index.html` imports `src/main.ts`.
- `npm run build` – bundle the app into `dist/` (HTML/CSS/JS, tree-shaken).
- `npm run preview` – serve the built bundle locally for smoke tests.
- `npm run lint` – run Biome check with auto-fix on project sources.
Run commands from the repo root.

## Coding Style & Naming Conventions
- TypeScript with ES modules, `const`/`let`, 2-space indentation, and double quotes for strings; keep imports grouped by origin (node, npm, local).
- Follow Biome formatting/lint defaults; avoid unused vars and prefer explicit `return` paths.
- Name functions and variables in `camelCase`; exported modules/components in `PascalCase` only when they represent classes or singletons.
- Asset files follow the existing pattern (`type_*.png`, control icons); keep filenames lowercase with dashes/underscores for readability. Prefer `public/` for static files.

## Testing Guidelines
- No automated test suite is present; rely on manual verification.
- Typical flow: `npm run dev`, load `public/gpx/example.gpx` (or another sample) via the UI or a URL, zoom/pan, switch basemaps, test fullscreen/location controls, and inspect cache popups.
- For data parsing changes, exercise multiple GPX samples (found vs unfound caches, different sizes) to avoid regressions in icons and metadata.

## Commit & Pull Request Guidelines
- Use concise, imperative commits (e.g., `fix: handle empty cache size`, `docs: clarify build steps`); group unrelated changes separately.
- PRs should include a brief summary, linked issues (if any), screenshots or GIFs for UI/visual updates, and noted manual test steps.
- Avoid committing generated `dist/` output unless explicitly needed for a release; prefer source changes plus build instructions.

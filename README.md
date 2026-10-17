# React Pub Map

React Pub Map is a website which lets you explore the pubs of Cambridge in the form of the iconic London Underground map.

<img width="256" alt="Cambridge Pub Map icon" src="public/images/pubmap-256x256.png">

## Development

Requires the Node version in `.nvmrc` (`nvm use`).

- `npm install`
- `npm start` – dev server on http://localhost:3000
- `npm test` – run tests with Vitest
- `npm run build` – production build to `build/` (deployed by Netlify)

## Updating the map

The map is generated from `scripts/pubs.json`. After editing it, run `npm run build:prepare` to regenerate `src/cambridge-pub-map.svg`, `src/cambridge-pub-map.json` and `public/cambridge-pub-map.pdf`. See [scripts/README.md](scripts/README.md).

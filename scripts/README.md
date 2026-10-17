`npm run build:prepare` runs these in order and moves the outputs into `src/` and `public/`:

```
node ./scripts/create-svg.js --top 100 --right 80 --bottom 0 --left 80
node ./scripts/create-metadata.js
node ./scripts/create-pdf.js
```

`create-metadata.js` uses Puppeteer, so it needs Chromium. If `npm install` skipped the download, run `node node_modules/puppeteer/install.js`.

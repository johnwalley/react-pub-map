#!/bin/bash
node ./scripts/create-svg.js --top 100 --right 80 --bottom 0 --left 80 && node ./scripts/create-metadata.js && node ./scripts/create-pdf.js
mv ./scripts/cambridge-pub-map.json ./src/cambridge-pub-map.json
mv ./scripts/cambridge-pub-map.svg ./src/cambridge-pub-map.svg
mv ./scripts/cambridge-pub-map.pdf ./public/cambridge-pub-map.pdf


#!/usr/bin/env node
const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const content = fs.readFileSync("./scripts/cambridge-pub-map.svg", "utf-8");
  const json = JSON.parse(fs.readFileSync("./scripts/pubs.json", "utf-8"));

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(content);

  const metadata = await page.evaluate(() => {
    const text = [...document.querySelectorAll("text")];
    const stations = [...document.querySelectorAll(".station")];
    const interchanges = [...document.querySelectorAll(".interchange")];

    const regex = /translate\((\d+.\d+),(\d+.\d+)\)/;

    return {
      text: text.map((t) => ({
        name: t.parentElement.id,
        strike: t.style.textDecoration === "line-through",
        bbox: {
          x: t.getBBox().x,
          y: t.getBBox().y,
          width: t.getBBox().width,
          height: t.getBBox().height,
        },
      })),
      stations: stations.map((s) => ({
        name: s.id,
        x: s.getPointAtLength(0).x,
        y: s.getPointAtLength(0).y,
      })),
      interchanges: interchanges.map((i) => ({
        name: i.parentElement.id,
        x: +regex.exec(i.getAttribute("transform"))[1],
        y: +regex.exec(i.getAttribute("transform"))[2],
      })),
    };
  });

  fs.writeFile(
    "./scripts/cambridge-pub-map.json",
    JSON.stringify(
      metadata.text.map((x) => ({
        ...x,
        ...metadata.stations.find((s) => s.name === x.name),
        ...metadata.interchanges.find((i) => i.name === x.name),
        label: json.stations[x.name].name,
      }))
    ),
    function () {
      console.log("Successfully wrote file to ./cambridge-pub-map.json");
    }
  );

  await browser.close();
})();

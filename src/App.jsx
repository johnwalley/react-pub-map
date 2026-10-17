import "leaflet/dist/leaflet.css";
import "./App.css";

import {
  Circle,
  ImageOverlay,
  MapContainer,
  Rectangle,
  ZoomControl,
} from "react-leaflet";
import React, { useState } from "react";

import { CRS } from "leaflet";
import MapControl from "./MapControl";
import Select from "react-select";
import imageUrl from "./cambridge-pub-map.svg";
import metadata from "./cambridge-pub-map.json";

const width = 715.6065;
const height = 595.28;
const bounds = [
  [0, 0],
  [height, width],
];
const MAX_ZOOM = 2;

const pubPosition = (pub) => [height - pub.y, pub.x];

const App = () => {
  const [map, setMap] = useState(null);
  const [selectedPub, setSelectedPub] = useState(null);

  const onPubClicked = (pub) => {
    map.panTo(pubPosition(pub));
  };

  const onPubSelected = (pub) => {
    setSelectedPub(pub);

    if (pub !== null) {
      map.setView(pubPosition(pub), MAX_ZOOM);
    }
  };

  return (
    <React.Fragment>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          marginTop: 10,
          marginLeft: 10,
          zIndex: 10000,
          width: 240,
        }}
      >
        <Select
          inputId="pub-select"
          aria-label="Choose a pub"
          autoFocus
          options={metadata}
          getOptionValue={(pub) => pub.name}
          isClearable
          name="selected-pub"
          value={selectedPub}
          onChange={onPubSelected}
          placeholder="Choose a pub..."
        />
      </div>
      <MapContainer
        ref={setMap}
        crs={CRS.Simple}
        center={[height / 2, width / 2]}
        zoom={1}
        maxZoom={MAX_ZOOM}
        minZoom={0}
        maxBounds={bounds}
        attributionControl={false}
        zoomControl={false}
      >
        <ImageOverlay url={imageUrl} bounds={bounds} />
        {metadata.map((pub) => (
          <Rectangle
            key={pub.name}
            bounds={[
              [height - pub.bbox.y, pub.bbox.x],
              [
                height - pub.bbox.y - pub.bbox.height,
                pub.bbox.x + pub.bbox.width,
              ],
            ]}
            pathOptions={{ opacity: 0, fillOpacity: 0 }}
            eventHandlers={{ click: () => onPubClicked(pub) }}
          />
        ))}
        {metadata
          .filter((pub) => !isNaN(pub.x))
          .map((pub) => (
            <Circle
              key={pub.name}
              center={pubPosition(pub)}
              radius={10}
              pathOptions={{ opacity: 0, fillOpacity: 0 }}
              eventHandlers={{ click: () => onPubClicked(pub) }}
            />
          ))}
        <ZoomControl position="bottomright" />
        <MapControl position="bottomleft">
          <a href="cambridge-pub-map.pdf" className="button">
            Download PDF
          </a>
        </MapControl>
      </MapContainer>
    </React.Fragment>
  );
};

export default App;

import React, { Component } from 'react';
import { CRS } from 'leaflet';
import {
  Map,
  ImageOverlay,
  Rectangle,
  Circle,
  Tooltip,
  ZoomControl,
} from 'react-leaflet';
import RetinaImage from 'react-retina-image';
import 'leaflet/dist/leaflet.css';
import './App.css';

const imageUrl = require('./cambridge-pub-map.svg');
const metadata = require('./cambridge-pub-map.json');
const width = 1600;
const height = 1000;
const DEFAULT_VIEWPORT = {
  center: [height / 2, width / 2],
  zoom: 1,
};

class App extends Component {
  state = {
    viewport: DEFAULT_VIEWPORT,
  };

  onClick = point => {
    if (isNaN(point[0]) || isNaN(point[1])) return;
    this.setState({ viewport: { center: point, zoom: this.state.zoom } });
  };

  onViewportChanged = viewport => {
    this.setState({ viewport });
  };

  render() {
    return (
      <Map
        crs={CRS.Simple}
        viewport={this.state.viewport}
        onViewportChanged={this.onViewportChanged}
        maxZoom={2}
        minZoom={0}
        maxBounds={[[0, 0], [height, width]]}
        attributionControl={false}
        zoomControl={false}
      >
        <ImageOverlay url={imageUrl} bounds={[[0, 0], [height, width]]} />
        {metadata.map(pub => (
          <Rectangle
            key={pub.name}
            bounds={[
              [height - pub.bbox.y, pub.bbox.x],
              [
                height - pub.bbox.y - pub.bbox.height,
                pub.bbox.x + pub.bbox.width,
              ],
            ]}
            opacity={0}
            fillOpacity={0}
            onClick={() => this.onClick([height - pub.y, pub.x])}
          />
        ))}
        {metadata
          .filter(pub => !isNaN(pub.x))
          .map(pub => (
            <Circle
              key={pub.name}
              center={[height - pub.y, pub.x]}
              radius={10}
              opacity={0}
              fillOpacity={0}
              onClick={() => this.onClick([height - pub.y, pub.x])}
            />
          ))}
        <ZoomControl position="bottomright" />
      </Map>
    );
  }
}

export default App;

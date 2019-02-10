import React, { Component } from 'react';
import { CRS } from 'leaflet';
import {
  Map,
  ImageOverlay,
  Rectangle,
  Circle,
  ZoomControl,
} from 'react-leaflet';
import Select from 'react-select';
import Control from 'react-leaflet-control';
import 'leaflet/dist/leaflet.css';
import 'react-select/dist/react-select.css';
import './App.css';

const imageUrl = require('./cambridge-pub-map.svg');
const metadata = require('./cambridge-pub-map.json');
const width = 715.6065;
const height = 595.28;
const DEFAULT_VIEWPORT = {
  center: [height / 2, width / 2],
  zoom: 1,
};

class App extends Component {
  state = {
    viewport: DEFAULT_VIEWPORT,
    value: '',
  };

  onPubSelected = name => {
    const pub = metadata.find(pub => pub.name === name);
    const point = [height - pub.y, pub.x];

    this.setState({ viewport: { center: point, zoom: this.state.zoom } });
  };

  onClick = point => {
    this.setState({ viewport: { center: point, zoom: this.state.zoom } });
  };

  onViewportChanged = viewport => {
    this.setState({ viewport });
  };

  updateValue = newValue => {
    this.setState({
      selectValue: newValue,
    });

    if (newValue !== null) {
      this.onPubSelected(newValue);
    }
  };

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            marginTop: 10,
            marginLeft: 10,
            zIndex: 10000,
          }}
        >
          <Select
            style={{ width: '240px' }}
            id="pub-select"
            ref={ref => {
              this.select = ref;
            }}
            valueKey="name"
            onBlurResetsInput={false}
            onSelectResetsInput={false}
            autoFocus
            options={metadata}
            simpleValue
            clearable={true}
            name="selected-pub"
            value={this.state.selectValue}
            onChange={this.updateValue}
            searchable={true}
            onValueClick={() => this.onPubSelected(this.state.selectValue)}
            placeholder="Choose a pub..."
          />
        </div>
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
          <Control position="bottomleft">
            <a href="cambridge-pub-map.pdf" class="button">
              Download PDF
            </a>
          </Control>
        </Map>
      </React.Fragment>
    );
  }
}

export default App;

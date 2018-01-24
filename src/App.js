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
import Autosuggest from 'react-autosuggest';
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

const pubs = metadata;

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : pubs.filter(
        lang => lang.label.toLowerCase().slice(0, inputLength) === inputValue
      );
};

const getSuggestionValue = suggestion => suggestion.label;
const renderSuggestion = suggestion => <div>{suggestion.label}</div>;

class App extends Component {
  state = {
    viewport: DEFAULT_VIEWPORT,
    value: '',
    suggestions: [],
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

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Find a pub',
      value,
      onChange: this.onChange,
    };

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
          <Autosuggest
            suggestions={suggestions}
            onSuggestionSelected={(event, { suggestion }) =>
              this.onPubSelected(suggestion.name)
            }
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
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
        </Map>
      </React.Fragment>
    );
  }
}

export default App;

import React, { Component } from 'react';
import * as d3 from 'd3';
import { tubeMap } from 'd3-tube-map';
import data from './pubs.json';

class Map extends Component {
  componentDidMount() {
    const container = d3.select(this.map);

    const width = 1600;
    const height = 1024;

    const map = tubeMap()
      .width(width)
      .height(height)
      .margin({
        top: height / 50,
        right: width / 7,
        bottom: height / 10,
        left: width / 7,
      });

    container.datum(data).call(map);
  }

  render() {
    return (
      <div
        ref={map => {
          this.map = map;
        }}
        style={{ height: '100%' }}
      />
    );
  }
}

export default Map;

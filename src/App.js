import * as React from 'react';
import * as d3 from 'd3';
import MapLayer from './components/MapLayer.js';
import MapContainer from './components/MapContainer.js';
import MonthButtons from './components/MonthButtons.js';
import './App.css';

class App extends React.Component {

  state = {
    month: 'march',
    zoomTransform: null,
  };

  componentWillMount() {
    this.getMapData();
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.state.month !== prevState.month) {
      this.getMapData();
    }
  }

  render() {
    return (
      <div id="container">
        <div id="innerContainer">
          <div id="buttonContainer">
            <h1>Elgin Street in 2019</h1>
            <h2>Retail and restaurant changes while one of Ottawa's main downtown roads is closed for construction</h2>

            <MonthButtons selectedMonth={this.state.month} updateMonth={this.updateMonth} />

          </div>

          <div>
            <MapContainer onZoom={this.updateZoom}>
              <MapLayer
                fill="#247BA0"
                stroke="#C9C9C9"
                strokeWidth="0.2"
                zoomTransform={this.state.zoomTransform}
                month={this.state.month}
                mapData={this.state.mapData}
                tooltipStyle="biz"
              />

              <MapLayer
                fill="#b2dbbf"
                stroke="#C9C9C9"
                strokeWidth="0.2"
                zoomTransform={this.state.zoomTransform}
                month={this.state.month}
                mapData={this.state.amenitiesData}
              />

              <MapLayer
                stroke="#363457"
                strokeWidth="2"
                zoomTransform={this.state.zoomTransform}
                month={this.state.month}
                mapData={this.state.roadsData}
                tooltipStyle="roads"
              />

              <MapLayer
                fill="#b2dbbf"
                zoomTransform={this.state.zoomTransform}
                month={this.state.month}
                mapData={this.state.parksData}
              />
            </MapContainer>
          </div>
        </div>

        <span>Made using Open Street Map data, d3.js and the Google Places API.</span>
      </div>
    );
  }

  updateZoom = (zoomTransform) => {
    this.setState({ zoomTransform })
  }

  getBizData() {
    d3.json('/biz.geojson')
      .then(({ features }) => {
        const file = `biz-${this.state.month}.csv`;
        d3.csv(file)
          .then((csvData) => {
            features.map((features) => {
              csvData.map(({ id, name, bizStatus, notes }) => {
                if (Number(id) === features.properties.id) {
                  features.properties.name = name
                  features.bizStatus = bizStatus
                  features.notes = notes
                }
              })
            })
          })
        this.setState({ mapData: features })
      })
  }

  getMapData() {

    this.getBizData();

    d3.json('/roads.geojson')
      .then((data) => {
        this.setState({ roadsData: data.features })
      })

    d3.json('/parks.geojson')
      .then((data) => {
        this.setState({ parksData: data.features })
      })

    d3.json('/amenities.geojson')
      .then((data) => {
        this.setState({ amenitiesData: data.features })
      })
  }

  updateMonth = (month) => {
    this.setState({month});
  }
}

export default App;
 
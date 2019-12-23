import * as React from 'react';
import * as d3 from 'd3';
import MapLayer from './components/MapLayer.js';
import MapContainer from './components/MapContainer.js';
import MonthButtons from './components/MonthButtons.js';
import './App.css';

class App extends React.Component {

  state = {
    month: 'january',
    zoomTransform: null,
    autoPlay: false,
  };

  componentWillMount() {
    this.getMapData();
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.state.month !== prevState.month || this.state.autoPlay != prevState.autoPlay) {
      this.getMapData();
    }
  }

  render() {
    return (
      <div id="container">
        <div id="innerContainer">
          <div id="buttonContainer">
            <h1>Elgin Street in 2019</h1>
            <h2>One of Ottawa's main downtown roads was closed for almost all of 2019. See what retail and restaurant changes occurred over the year.</h2>

            <div>
              <div className='controls'>
                <button aria-pressed={this.state.autoPlay} className="autoPlay" onClick={() => this.autoPlay()}>&#9658;</button>
                <span onClick={() => this.autoPlay()}>Play the whole year</span>
              </div>

              <MonthButtons selectedMonth={this.state.month} updateMonth={this.updateMonthViaButtons} />
            </div>

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

        <div className="legend"> 
          <div><span className="closed"/> Closed</div>
          <div><span className="open"/> Open</div>
          <div><span className="public"/> Public space</div>
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
      .then(async ({ features }) => {
        const file = `biz-${this.state.month}.csv`;
        await d3.csv(file)
          .then((csvData) => {
            features.map((features) => {
              csvData.map(({ id, name, bizStatus, description, rating }) => {

                if (Number(id) === features.properties.id) {
                  features.properties.name = name
                  features.bizStatus = bizStatus
                  features.rating = rating
                  features.description = description
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
    this.setState({ month });
  }

  updateMonthViaButtons = (month) => {
    this.updateMonth(month);
    this.setState({ autoPlay: false });
  }

  autoPlay() {

    this.setState({ autoPlay: true });

    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    months.forEach((currentMonth, i) => {
      setTimeout(() => {
        const nextMonth = months[(months.findIndex((month) => month === currentMonth)) + 1];

        if (nextMonth != null && this.state.autoPlay == true) {
          this.updateMonth(nextMonth);
        }

        if (i + 1 === months.length) {
          this.setState({ autoPlay: false });
        }
      }, i * 1000);
    });

  }
}

export default App;

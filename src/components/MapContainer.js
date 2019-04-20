import * as d3 from "d3";
import * as React from 'react';

export default class MapContainer extends React.Component {
    ref = React.createRef();

    zoom = d3.zoom()
        .scaleExtent([1, 4])
        .extent([[0, 0], [300, 570]])
        .translateExtent([[100, 0], [230, 570]])
        .on("zoom", this.zoomed.bind(this));

    zoomed() {
        this.props.onZoom(d3.event.transform);
    }

    state = {
        zoomTransform: null,
    };

    componentWillMount() {
        const svg = d3.select(this.ref.current);
        svg.call(this.zoom);
    }

    componentDidUpdate() {
        const svg = d3.select(this.ref.current);
        svg.call(this.zoom);
    }


    render() {

        return (<div id="mapContainer">
            <div id="controls">
                <button id="zoomIn" onClick={this.buttonZoomIn}>+</button>
                <button id="zoomOut" onClick={this.buttonZoomOut}>-</button>
            </div>

            <svg ref={this.ref} width="300" height="570">
                {this.props.children}
            </svg></div>
        )
    }
    buttonZoomOut = () => {
        const svg = d3.select(this.ref.current)
            .transition()
            .duration(500);

        this.zoom.scaleBy(svg, -1.2);
    }

    buttonZoomIn = () => {
        const svg = d3.select(this.ref.current)
            .transition()
            .duration(500);

        this.zoom.scaleBy(svg, 1.2);
    }

}
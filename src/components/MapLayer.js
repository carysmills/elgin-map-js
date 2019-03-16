import * as d3 from "d3";
import * as React from 'react';

export default class MapLayer extends React.Component {
    ref = React.createRef();
    tooltipOffset = { x: 5, y: -25 };
    tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");
    
    componentDidUpdate(prevProps) {
        if (this.props.mapData !== prevProps.mapData) {
            this.makeMap();
        }
    }

    shouldComponentUpdate(prevProps) {
        if (this.props.mapData !== prevProps.mapData ||
            this.props.zoomTransform !== prevProps.zoomTransform ||
            this.props.month !== prevProps.month) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        return <g transform={this.props.zoomTransform} ref={this.ref} />;
    }

    makeMap() {
        // temporary solution to the data 
        // not being able to find properties initially 
        setTimeout(() => {
            const ref = this.ref.current;
            const width = 300;
            const height = 570;
            const { fill, stroke, strokeWidth, mapData } = this.props;
            const svg = d3.select(ref);
    
            const projection = d3.geoMercator()
                .scale(5760000)
                .translate([width / 2, height / 2])
                .rotate([75.689767, -45.416985, -31])
    
            const path = d3.geoPath()
                .projection(projection);
    
            svg.selectAll("path")
                .data(mapData)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("stroke", stroke)
                .attr("stroke-width", strokeWidth)
                .attr("fill", fill)
                .on("mouseover", this.showTooltip)
                .on("mousemove", this.moveTooltip)
                .on("mouseout", this.hideTooltip);

            svg.selectAll("path")
                .filter((d) => { return d.bizStatus && d.bizStatus.includes('closed') })
                .transition()
                .duration(300)
                .attr("fill", "#363457");

            svg.selectAll("path")
                .filter((d) => { return !d.bizStatus || !d.bizStatus.includes('closed') })
                .transition()
                .duration(300)
                .attr("fill", fill);

        }, 50)
    }

    moveTooltip = () => {
        const top = d3.event.pageY + this.tooltipOffset.y;
        const left = d3.event.pageX + this.tooltipOffset.x;

        this.tooltip.style("top", `${top}px`)
            .style("left", `${left}px`);
    }

    hideTooltip = () => {
        this.tooltip.style("display", "none");
    }

    showTooltip = (d) => {
        this.moveTooltip();
        const { tooltipStyle } = this.props;

        const number = d.properties["addr:housenumber"];
        const street = d.properties["addr:street"];
        const name = d.properties.name;
        const tooltip = this.tooltip.style("display", "block");

        if (tooltipStyle === 'biz') {
            tooltip.html(`<b>${name}</b><br>${number} ${street}`)
        } else if(tooltipStyle === 'roads') {
            tooltip.html(`<b>${name}</b>`)
        } else {
            tooltip.html(`${number} ${street}`)
        }
    }
}
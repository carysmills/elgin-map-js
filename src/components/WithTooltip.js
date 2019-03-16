import * as d3 from "d3";
import * as React from 'react';


const withTooltip = (WrappedComponent) => {
    class HOC extends React.Component {

        tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");

        tooltipOffset = { x: 5, y: -25 };

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    moveTooltip={this.moveTooltip}
                    hideTooltip={this.hideTooltip}
                    showTooltip={this.showTooltip}
                />
            );
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
            } else if (tooltipStyle === 'roads') {
                tooltip.html(`<b>${name}</b>`)
            } else {
                tooltip.html(`${number} ${street}`)
            }
        }
    }

    return HOC;
};

export default withTooltip;
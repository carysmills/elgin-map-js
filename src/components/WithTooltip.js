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

            const number = d.properties["addr:housenumber"] ? d.properties["addr:housenumber"] : '';
            const street = d.properties["addr:street"] ? d.properties["addr:street"] : '';
            const name = d.properties.name;
            const rating = d.rating;
            const type = d.description;
            const status = d.bizStatus;
            const tooltip = this.tooltip.style("display", "block");
            const notes = d.notes ?  `<br><br><b>Formerly:</b><br>${d.notes}` : '';

            if (tooltipStyle === 'biz') {
                tooltip.html(
                    `<p><b>${name}</b></p>
                    <p><b>Status:</b> ${status}</p>
                    <p><b>Type:</b> ${type}</p>
                    <p><b>Rating:</b> ${rating}</p>
                    <p>${number} ${street}</p>
                    `)
            } else if (tooltipStyle === 'roads') {
                tooltip.html(`<b>${name}</b>`)
            } else {

                tooltip.html(`${name} <br> ${number} ${street}`)
            }
        }
    }

    return HOC;
};

export default withTooltip;
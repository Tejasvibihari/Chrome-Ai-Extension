import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Pie({ d, width = 400, height = 400 }) {
    const svgRef = useRef();
    const title = d.chartTitle;
    const description = d.description;

    // Convert JSON to an array of objects
    const data = d.labels.map((label, index) => ({
        label,
        value: d.data[index]
    }));

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render

        // Define margins
        const margin = { top: 60, right: 40, bottom: 40, left: 40 }; // Increased top margin
        const graphWidth = width - margin.left - margin.right;
        const graphHeight = height - margin.top - margin.bottom;
        const radius = Math.min(graphWidth, graphHeight) / 2;

        // Define color scale
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Create pie and arc generators
        const pie = d3.pie().value(d => d.value);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        // Create arcs from data
        const arcs = pie(data);

        // Set up the SVG container
        const svgContainer = svg
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr(
                "transform",
                `translate(${margin.left + graphWidth / 2}, ${margin.top + graphHeight / 2})`
            ); // Center the pie chart with margins

        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2) // Position the title above the chart
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text(title)
            .attr("fill", "white");

        // Draw pie chart slices
        svgContainer
            .selectAll("path")
            .data(arcs)
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => color(i))
            .attr("stroke", "white")
            .attr("stroke-width", 2);

        // Add labels to the slices
        svgContainer
            .selectAll("text")
            .data(arcs)
            .enter()
            .append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`) // Position at the center of each slice
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "white")
            .text(d => `${d.data.label}: ${d.data.value}`); // Display both label and value

        // Display the label
    }, [data, width, height]);

    return (
        <div className="border border-primary-100 p-2 rounded-md w-auto mt-4 flex-grow overflow-auto ">
            <svg ref={svgRef} className="w-full"></svg>
            <p className="text-white font-kanit break-words w-full">
                <span className="font-kanit text-primary-100">Description :- </span>
                {description}
            </p>
        </div>
    );
}
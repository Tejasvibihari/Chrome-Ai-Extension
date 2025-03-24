import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Bar({ data, width = 400, height = 400 }) {
    const svgRef = useRef();
    const xAxisLabel = data.xAxisLabel;
    const yAxisLabel = data.yAxisLabel
    const title = data.title;
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 1, bottom: 45, left: 50 };
        const graphWidth = width - margin.left - margin.right;
        const graphHeight = height - margin.top - margin.bottom;

        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([0, graphWidth])
            .padding(0.5);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .nice()
            .range([graphHeight, 0]);

        const svgContainer = svg
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svgContainer
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d) => xScale(d.name))
            .attr("y", (d) => yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => graphHeight - yScale(d.value))
            .attr("fill", "#4A90E2");

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svgContainer
            .append("g")
            .attr("transform", `translate(0,${graphHeight})`)
            .call(xAxis);

        svgContainer.append("g").call(yAxis);

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text(title);

        svgContainer.append("text")
            .attr("x", graphWidth / 2)
            .attr("y", graphHeight + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style('fill', "white")
            .text(xAxisLabel);

        svgContainer.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -graphHeight / 2)
            .attr("y", -margin.left + 20)
            .attr("text-anchor", "middle")
            .style('fill', "white")
            .style("font-size", "14px")
            .text(yAxisLabel);
    }, [data, width, height]);

    return (
        <>
            <svg ref={svgRef}></svg>
        </>
    );
};

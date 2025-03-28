import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Bar({ d, width = 400, height = 400 }) {
    const svgRef = useRef();
    console.log(d);

    const title = d.chartTitle;
    const description = d.description;
    const xAxisLabel = d.xAxisLabel;
    const yAxisLabel = d.yAxisLabel;
    const data = d.data;

    // Extract dynamic keys
    const keys = Object.keys(data[0]);
    const xKey = keys[0]; // Assuming first key is the x-axis category
    const yKey = keys[1]; // Assuming second key is the y-axis value

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 40, right: 20, bottom: 100, left: 60 };
        const graphWidth = width - margin.left - margin.right;
        const graphHeight = height - margin.top - margin.bottom;

        // Find min & max values
        const yMin = d3.min(data, (d) => d[yKey]);
        const yMax = d3.max(data, (d) => d[yKey]);

        // Ensure the y-axis includes 0 when there are only positive values
        const yScale = d3
            .scaleLinear()
            .domain([yMin < 0 ? yMin : 0, yMax]) // If yMin < 0, include it; otherwise, start from 0
            .nice()
            .range([graphHeight, 0]);

        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d[xKey]))
            .range([0, graphWidth])
            .padding(0.5);

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
            .attr("x", (d) => xScale(d[xKey]))
            .attr("y", (d) => d[yKey] >= 0 ? yScale(d[yKey]) : yScale(0)) // Start negative bars from 0
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => Math.abs(yScale(d[yKey]) - yScale(0))) // Adjust height for negatives
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10]); // Different colors for each bar

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svgContainer
            .append("g")
            .attr("transform", `translate(0,${graphHeight})`)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svgContainer.append("g").call(yAxis);

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text(title)
            .attr("fill", "white");

        svgContainer.append("text")
            .attr("x", graphWidth / 2)
            .attr("y", graphHeight + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "white")
            .text(xAxisLabel);

        svgContainer.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -graphHeight / 2)
            .attr("y", -margin.left + 20)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "14px")
            .text(yAxisLabel);
    }, [data, width, height]);

    return (
        <>
            <div className="border border-primary-100 p-2 rounded-md w-auto flex-grow overflow-auto ">
                <svg ref={svgRef} className="w-full"></svg>
                <p className="text-white font-kanit break-words w-full">
                    <span className="font-kanit text-primary-100">Description :- </span>
                    {description}
                </p>
            </div>

        </>
    )
}

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function Hierarchy() {
    const svgRef = useRef();

    const data = {
        name: "CEO",
        children: [
            {
                name: "VP of Sales",
                children: [
                    {
                        name: "Regional Manager 1",
                        children: [
                            {
                                name: "Salesperson 1",
                                children: [{
                                    name: "Tejasvi Kumar"
                                }]
                            },
                            {
                                name: "Salesperson 1",
                                children: [{
                                    name: "Tejasvi Kumar"
                                }]
                            }, {
                                name: "Salesperson 1",
                                children: [{
                                    name: "Tejasvi Kumar"
                                }]
                            },
                        ],
                    },
                    {
                        name: "Regional Manager 2",
                        children: [
                            { name: "Salesperson 4" },
                            { name: "Salesperson 5" },
                        ],
                    },
                ],
            },
            {
                name: "VP of Marketing",
                children: [
                    {
                        name: "Marketing Manager 1",
                        children: [
                            { name: "Content Specialist 1" },
                            { name: "Content Specialist 2" },
                        ],
                    },
                    {
                        name: "Marketing Manager 2",
                        children: [
                            { name: "SEO Specialist 1" },
                            { name: "SEO Specialist 2" },
                            { name: "Social Media Manager" },
                        ],
                    },
                ],
            },
            {
                name: "VP of Engineering",
                children: [
                    {
                        name: "Engineering Manager 1",
                        children: [
                            { name: "Software Engineer 1" },
                            { name: "Software Engineer 2" },
                            { name: "Software Engineer 3" },
                        ],
                    },
                    {
                        name: "Engineering Manager 2",
                        children: [
                            { name: "DevOps Engineer 1" },
                            { name: "DevOps Engineer 2" },
                        ],
                    },
                    {
                        name: "Engineering Manager 3",
                        children: [
                            { name: "QA Engineer 1" },
                            { name: "QA Engineer 2" },
                            { name: "QA Engineer 3" },
                            { name: "QA Engineer 4" },
                        ],
                    },
                ],
            },
        ],
    };

    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .attr('width', 1880) // Set a large width for the graph
            .attr('height', 1000) // Set a large height for the graph
            .style('border', '1px solid black');

        const root = d3.hierarchy(data);

        // Dynamically calculate the size of the tree layout
        const nodeCount = root.descendants().length;
        const depth = root.height + 1;
        const treeWidth = Math.max(500, depth * 200); // Adjust width based on depth
        const treeHeight = Math.max(500, nodeCount * 25); // Adjust height based on nodes

        const treeLayout = d3.tree().size([treeHeight, treeWidth]); // Swap width and height for horizontal layout
        treeLayout(root);

        // Center the graph by translating it
        const svgGroup = svg.append("g")
            .attr("transform", `translate(${treeWidth / 2}, ${treeHeight / 8})`); // Adjusted translation

        // Links (lines)
        svgGroup.selectAll(".link")
            .data(root.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", d3.linkHorizontal() // Use horizontal links
                .x(d => d.y) // Swap x and y
                .y(d => d.x))
            .attr("fill", "none")
            .attr("stroke", "#CC72F2");

        // Nodes (circles and text)
        const nodes = svgGroup.selectAll(".node")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.y},${d.x})`); // Swap x and y

        nodes.append("circle")
            .attr("r", 10)
            .attr("fill", "#290885");

        nodes.append("text")
            .attr("dy", 3)
            .attr("x", 15)
            .text(d => d.data.name)
            .attr("font-size", "14px")
            .attr("fill", "white");

    }, [data]);

    return (
        <div style={{ overflow: "auto", width: "auto", height: "auto" }}>
            <svg ref={svgRef}></svg>
        </div>
    );
}
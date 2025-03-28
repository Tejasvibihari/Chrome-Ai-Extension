import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm'
import Cube from './Cube';
import Bar from './graph/Bar';
import Area from './graph/Area';
import Pie from './graph/Pie';

export default function Chat() {
    const messages = useSelector(state => state.chat.messages);
    console.log(messages);
    // Function to clean and parse JSON from a message
    const parseJSONFromMessage = (content) => {
        // Ensure content is a string before proceeding

        // Step 1: Remove Markdown code block markers (```json\n and ```)
        let cleanedResponse = content.replace(/```json\n|```/g, '');

        // Step 2: Parse the JSON string into a JavaScript object
        try {
            let jsonData = JSON.parse(cleanedResponse);
            return jsonData; // Return the parsed JSON object
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null; // Return null if parsing fails
        }
    };
    const data = [
        {
            "chartTitle": "Types of Robots",
            "chartType": "pie",
            "description": "Distribution of different types of robots in various industries.",
            "labels": [
                "Humanoid Robots",
                "Cobots",
                "Industrial Robots",
                "Medical Robots",
                "Agricultural Robots",
                "Microrobotics",
                "Augmenting Robots",
                "Software Bots"
            ],
            "data": [
                10,
                15,
                25,
                20,
                10,
                5,
                10,
                5
            ]
        },
        {
            "chartTitle": "Pros and Cons of Robotics",
            "chartType": "bar",
            "description": "Comparison of the pros and cons associated with robotics.",
            "xAxisLabel": "Aspects",
            "yAxisLabel": "Count",
            "data": [
                {
                    "aspect": "Increased Accuracy",
                    "count": 1
                },
                {
                    "aspect": "Enhanced Productivity",
                    "count": 1
                },
                {
                    "aspect": "Improved Safety",
                    "count": 1
                },
                {
                    "aspect": "Job Losses",
                    "count": -1
                },
                {
                    "aspect": "Limited Creativity",
                    "count": -1
                },
                {
                    "aspect": "Data Security Risks",
                    "count": -1
                },
                {
                    "aspect": "Maintenance Costs",
                    "count": -1
                },
                {
                    "aspect": "Environmental Waste",
                    "count": -1
                }
            ]
        }
    ]
    return (
        <div className='flex-grow p-4 overflow-auto custom-scrollbar'>
            {messages.length > 0 ? (
                <div className="text-white">
                    {messages.map((message, index) => (
                        <div key={index}
                            className={`${message.role === "User" ? "bg-[#2f2f2f] p-3 my-2 flex items-center justify-start ml-auto rounded-lg" : ""}`}>
                            <ReactMarkdown
                                key={index}
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        return !inline ? (
                                            <pre className="text-pre-wrap" style={{ backgroundColor: "#2d2d2d", padding: "1em", borderRadius: "4px", overflowX: "auto" }}>
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    p({ node, ...props }) {
                                        return <p style={{ marginBottom: "1em", lineHeight: "1.5" }} {...props} />;
                                    },
                                    ul({ node, ...props }) {
                                        return <ul style={{ marginLeft: "1.5em", listStyleType: "disc" }} {...props} />;
                                    },
                                    ol({ node, ...props }) {
                                        return <ol style={{ marginLeft: "1.5em", listStyleType: "decimal" }} {...props} />;
                                    },
                                    li({ node, ...props }) {
                                        return <li style={{ marginBottom: "0.5em" }} {...props} />;
                                    },
                                    table({ node, ...props }) {
                                        return (
                                            <div className="styled-table">
                                                <table {...props} />
                                            </div>
                                        );
                                    },
                                    strong({ node, ...props }) { // Custom renderer for bold text
                                        return <strong style={{ color: "#CC72F2" }} {...props} />;
                                    }
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    ))}
                    {messages.map((message, index) => {
                        if (message.graph) {
                            const parsedJson = parseJSONFromMessage(message.graph);

                            // Check if parsedJson is valid before rendering
                            return (
                                <div key={index} className="p-3 my-2 rounded-lg">
                                    {parsedJson ? (

                                        <div style={{ color: "white", padding: "1em", borderRadius: "4px", marginBottom: "4px" }}>
                                            {parsedJson.charts.map((d, i) =>
                                                d.chartType === "bar" ? <Bar key={i} d={d} /> : null
                                            )}
                                            {parsedJson.charts.map((d, i) =>
                                                d.chartType === "pie" ? <Pie key={i} d={d} /> : null
                                            )}
                                        </div>
                                    ) : (
                                        <p style={{ color: "red" }}>Invalid JSON</p>
                                    )}
                                </div>
                            );
                        }
                        return null; // Return null if message.graph does not exist
                    })}
                    {/* <Pie d={data[0]} /> */}
                </div>

            ) : (
                <Cube />
            )}
        </div>
    );
}

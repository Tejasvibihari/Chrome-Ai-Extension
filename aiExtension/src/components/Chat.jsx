import React from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm'
import Cube from './Cube';
import Bar from './graph/Bar';

export default function Chat() {
    const messages = useSelector(state => state.chat.messages);
    const sampleData = [
        { name: "A", value: 30 },
        { name: "B", value: 80 },
        { name: "C", value: 45 },
        { name: "D", value: 60 },
        { name: "E", value: 20 },
        { name: "F", value: 90 }
    ];
    return (
        <>

            <div className='flex-grow p-4 overflow-auto custom-scrollbar'>
                {messages.length > 0 ?
                    <div className="text-white">
                        {messages.map((message, index) => (
                            <div key={index}
                                className={`${message && message.role === "User" && "bg-[#2f2f2f] p-3 my-2 flex items-center justify-start ml-auto rounded-lg"
                                    }`}>
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
                                    {message && message.content}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>
                    :
                    // <Cube />
                    <Bar data={sampleData} />
                }

            </div>
        </>
    )
}

import React from 'react'
import { useSelector } from 'react-redux'
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm'
import Cube from './Cube';

export default function Chat() {
    const messages = useSelector(state => state.chat.messages);
    console.log("Chat from chat component :-", messages);
    return (
        <>
            <div className='flex-grow p-4 overflow-auto custom-scrollbar'>
                {messages.length > 0 ?
                    <div className="text-white">
                        {messages.map((message, index) => (
                            <div key={index}
                                className={`${message && message.role === "User" && "bg-[#2f2f2f] p-3 my-2 flex items-center justify-start ml-auto rounded-lg"
                                    }`}>
                                <Markdown

                                    key={index}
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    components={{
                                        // Custom renderer for code blocks
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
                                        // Custom renderer for paragraphs to add spacing between them
                                        p({ node, ...props }) {
                                            return <p style={{ marginBottom: "1em", lineHeight: "1.5" }} {...props} />;
                                        },
                                        // Custom renderer for tables (if needed)
                                        table({ node, ...props }) {
                                            return (
                                                <div className="styled-table">
                                                    <table {...props} />
                                                </div>
                                            );
                                        },
                                    }}
                                >
                                    {message && message.content}
                                </Markdown>
                            </div>
                        ))}
                    </div>
                    :
                    <Cube />
                }

            </div>
        </>
    )
}

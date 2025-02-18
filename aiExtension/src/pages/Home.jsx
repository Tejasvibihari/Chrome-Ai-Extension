import { useEffect, useState } from 'react'
import { Send, Cog, ChevronsRight, ChevronRight } from 'lucide-react';
import client from '../service/axioxClient';
import Cube from '../components/Cube';
import { useSelector } from 'react-redux';
import { promptFailure, promptStart, promptSuccess } from '../app/Prompt/PromptSlice';
import { useDispatch } from 'react-redux';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from "remark-breaks";
import Sidebar from '../components/Sidebar';
import { startLoadingMessages } from '../utils/utils.js';
import "./Home.css";
import Topbar from '../components/Topbar.jsx';

// Showing The Response From Ai In The Frontend in Typewriter Effect
function useTypewriterEffect(text, speed = 50) {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, index));
            index++;
            if (index > text.length) {
                clearInterval(interval);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed]);

    return displayedText;
}

export default function Home() {
    const loading = useSelector(state => state.prompt.loading)
    const data = useSelector(state => state.prompt.data)
    const dispatch = useDispatch();
    const [request, setRequest] = useState({});
    const [response, setResponse] = useState("");
    const [prompt, setPrompt] = useState('');
    const [model, setModel] = useState('Auto');
    const [links, setLinks] = useState(false);
    const [qa, setQA] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [allLinks, setAllLinks] = useState([]);
    const [tabUrl, setTabUrl] = useState();

    // Response Show Case 
    const displayedLoadingMessage = useTypewriterEffect(loadingMessage, 50);
    const [fadeIn, setFadeIn] = useState(false);


    // Setting Button Drop Down 
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [chat, setChat] = useState(false);
    const [fullPageScan, setFullPageScan] = useState(false);
    const [viewScan, setViewScan] = useState(false);
    const [socialMedia, setSocialMedia] = useState(false);


    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };
    console.log(tabUrl);
    //    Handle Magic Button Click
    useEffect(() => {
        const magicButton = document.getElementById('magicButton');
        if (magicButton) {
            magicButton.addEventListener('click', startScraping);
        }

        return () => {
            if (magicButton) {
                magicButton.removeEventListener('click', startScraping);
            }
        };

    }, []);
    // Start Scrapping When Magic Button Clicked
    const startScraping = async () => {
        try {
            chrome.runtime.sendMessage({ action: "startScraping" }, async (response) => {
                if (response.success) {
                    dispatch(promptStart());
                    const messages = [
                        'Preparing your insights...',
                        'Unveiling patterns...',
                        'Crafting a thoughtful response...',
                        'Almost there, perfection takes time...'
                    ];

                    let messageIndex = 0;
                    const interval = setInterval(() => {
                        setLoadingMessage(messages[messageIndex]);
                        messageIndex = (messageIndex + 1) % messages.length;
                    }, 3000);
                    try {
                        const res = await client.post('/api/v0/scrape/webscrape', { model: model, type: "chat", url: response.url, links, qa });
                        console.log('First response:', res.data);
                        setAllLinks(res.data.allLinks);
                        setResponse(res.data.summarizedData);
                        dispatch(promptSuccess(res.data));
                        console.log('Second response:', res.data);
                        console.log(res.data)
                        setFadeIn(true);
                        setTimeout(() => setFadeIn(false), 3000);
                    } catch (error) {
                        dispatch(promptFailure());
                        console.log(error);
                    } finally {
                        clearInterval(interval);
                        setLoadingMessage('');
                    }
                } else {
                    console.error("Scraping failed", response.error);
                }
            });
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(() => {
        // Listen for messages from the service worker
        const handleMessage = (message) => {
            if (message.action === 'sendURL') {
                setTabUrl(message.url);
            }
        };
        if (chrome && chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener(handleMessage);
        } else {
            console.error('chrome.runtime.onMessage is not available');
        }
        // Cleanup listener on component unmount
        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);
    // For Sending Chat To The Backend 
    useEffect(() => {
        const createRequest = () => {
            setRequest({
                model,
                type: "chat",
                prompt: prompt,
                links: links,
                qa: qa
            });
        }
        createRequest();
    }, [prompt, model, links, qa]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(promptStart());
        const messages = [
            'Preparing your insights...',
            'Unveiling patterns...',
            'Crafting a thoughtful response...',
            'Almost there, perfection takes time...'
        ];

        let messageIndex = 0;
        const interval = setInterval(() => {
            setLoadingMessage(messages[messageIndex]);
            messageIndex = (messageIndex + 1) % messages.length;
        }, 3000);

        try {
            console.log(request)
            const response = await client.post('/api/v0/chat/gpt-4o-mini', request)
            setPrompt('');
            setResponse(response.data);
            dispatch(promptSuccess(response.data));
            setFadeIn(true);
            setTimeout(() => setFadeIn(false), 3000);

        } catch (error) {
            dispatch(promptFailure());
            console.log(error);
        } finally {
            clearInterval(interval);
            setLoadingMessage('');
        }
    }

    const containsTable = /\|.*\|/.test(response);
    return (
        <>
            {/* {isSidebarVisible && (
                <div className={`fixed top-0 left-0 w-full transition-transform z-50 duration-300 ${isSidebarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                    <Sidebar
                        toggleSidebar={toggleSidebar}
                        chat={chat}
                        setChat={setChat}
                        fullPageScan={fullPageScan}
                        setFullPageScan={setFullPageScan}
                        viewScan={viewScan}
                        setViewScan={setViewScan}
                        socialMedia={socialMedia}
                        setSocialMedia={setSocialMedia}
                    />
                </div>
            )} */}
            <div className='w-full h-[100vh] flex flex-col'>
                <Topbar />
                {/* <div className='bg-secondary-200 flex flex-row items-center justify-between'>
                    <div className='p-3  text-white font-kanit text-lg'>
                        Hello <span className='text-primary-100'>Tejasvi Bihari</span>
                    </div>
                    <div className='p-3 flex flex-row items-center justify-center space-x-2'>
                        <select
                            onChange={(e) => setModel(e.target.value)}
                            className=' w-28 p-1 font-kanit rounded-full focus:outline-none focus:shadow-sm shadow-sm shadow-primary-100 text-white bg-secondary-100'>
                            <option value="Auto">Auto</option>
                            <option value="gpt">GPT</option>
                            <option value="Gemini">Gemini</option>
                            <option value="Deepseek">Deepseek</option>
                        </select>
                        <div className='border border-secondary-200 p-1 rounded-md shadow-sm shadow-primary-100 cursor-pointer'>
                            <Cog onClick={toggleSidebar} className='text-gray-400' />
                        </div>
                    </div>
                </div> */}
                <div className='flex-grow p-4 overflow-auto custom-scrollbar'>
                    {/* Insert your additional content here */}
                    {/* Actual Response From an Ai  */}

                    {/* <div>
                        {response ? (
                            containsTable ? ( 
                                <div className="text-white styled-table">
                                    <pre className='text-pre-wrap'><Markdown remarkPlugins={[remarkGfm]}>{response}</Markdown></pre>
                                </div>
                            ) : (
                                <p className=" text-white ">
                                    <pre className='text-pre-wrap'> <Markdown remarkPlugins={[remarkGfm]}>{response}</Markdown></pre>
                                </p>
                            )
                        ) : (
                            <Cube className="z-10" />
                        )}
                    </div> */}

                    <div>
                        {response ? (
                            <div className="text-white">
                                <Markdown
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
                                    {response}
                                </Markdown>

                                {data.allLinks && data.allLinks &&
                                    <div>
                                        <h2 className='font-kanit my-2'>All Links of This Page</h2>
                                        <div className='styled-table'>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className='text-primary-100'>Text</th>
                                                        <th className='text-primary-100'>Link</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.allLinks.map((links, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{links.text}</td>
                                                                <td>
                                                                    <a className='hover:text-primary-100' href={links.href} target='_blank'>
                                                                        {links.href}
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                }
                            </div>

                        ) : (
                            <Cube className="z-10" />
                        )}
                    </div>
                </div>
                <div className='p-2 bg-secondary-200 flex items-center justify-center flex-col '>
                    <div className='flex items-center justify-center space-x-1 w-full'>
                        <textarea type='text' onChange={(e) => setPrompt(e.target.value)} value={prompt} placeholder='How Can I Help You ?' className='w-full p-1 rounded-se-md rounded-ss-md bg-secondary-100 focus:outline-none focus:shadow-sm focus:shadow-primary-100 text-white' />

                    </div>

                    <div className='flex flex-row items-center w-full justify-between bg-secondary-100 space-y-2 rounded-bl-md rounded-br-md p-2'>
                        <div className='flex items-center justify-center space-x-2'>
                            <button
                                className={`${links ? 'bg-primary-100 text-black border-primary-100 border' : 'border-black'} border  rounded-full font-kanit px-3 py-1 text-white hover:bg-primary-100 hover:text-black`}
                                onClick={() => setLinks(!links)}
                            >
                                Links
                            </button>
                            <button
                                className={`${qa ? 'bg-primary-100 text-black border-primary-100 border' : 'border-black'} border  rounded-full font-kanit px-3 py-1 text-white hover:bg-primary-100 hover:text-black`}
                                onClick={() => setQA(!qa)}
                            >
                                Q&A
                            </button>
                        </div>
                        <div className='flex items-center justify-center space-x-2'>
                            <button onClick={startScraping} id='magicButton' className='bg-primary-100 rounded-sm p-2 px-3 font-kanit border-primary-100 hover:border-white hover:border-1 hover:bg-white hover:text-primary-200'>
                                Start Magic
                            </button>
                            <button onClick={handleSubmit} className='p-2 border-primary-100 border rounded-full bg-primary-200'>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    <span className='min-h-5 h-5'>
                        {loading ?
                            <p className='text-xs text-gray-400 font-kanit items-center justify-center '>
                                {displayedLoadingMessage}
                            </p>
                            :
                            <p className='text-xs text-gray-400 font-kanit items-center justify-center '>
                                Ai can make mistakes, so double-check it
                            </p>
                        }

                    </span>
                </div>

            </div >
        </>
    )
}

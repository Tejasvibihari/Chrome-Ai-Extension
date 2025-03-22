import React, { useEffect, useState } from 'react'
import { Send } from 'lucide-react';
import client from '../service/axioxClient';
import { useSelector } from 'react-redux';
import { addMessage, chatFailure, chatInitiate, scrapeStart } from '../app/Chat/ChatSlice';
import { useDispatch } from 'react-redux';
import "./Home.css";
import Topbar from '../components/Topbar.jsx';
import Chat from '../components/Chat.jsx';
import { setContext } from '../app/Setting/SettingSlice.js';

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

// const MemoizedTopbar = React.memo(Topbar);
// const MemoizedChat = React.memo(Chat);

export default function Home() {
    const chat = useSelector(state => state.chat);
    const setting = useSelector(state => state.setting)
    const dispatch = useDispatch();
    const [response, setResponse] = useState("");
    const [prompt, setPrompt] = useState('');
    const [links, setLinks] = useState(false);
    const [qa, setQA] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [tabUrl, setTabUrl] = useState();


    // Response Show Case 
    const displayedLoadingMessage = useTypewriterEffect(loadingMessage, 50);
    const [fadeIn, setFadeIn] = useState(false);

    // Start Scrapping When Magic Button Clicked
    const startScraping = async () => {
        try {
            chrome.runtime.sendMessage({ action: "startScraping" }, async (response) => {
                if (response.success) {
                    dispatch(scrapeStart());
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
                        const res = await client.post('/api/v0/scrape/webscrape', { model: setting.model, url: response.url, links, qa });
                        dispatch(addMessage(res.data))
                        setFadeIn(true);
                        setTimeout(() => setFadeIn(false), 3000);
                    } catch (error) {
                        dispatch(chatFailure());
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(chatInitiate());
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
            dispatch(addMessage({ role: 'User', content: prompt }));
            const response = await client.post('/api/v0/chat/gpt-4o-mini', {
                model: setting.model,
                context: setting.context,
                prompt,
                contextData: chat.messages[0]
            });
            setPrompt('');
            dispatch(addMessage(response.data));
            console.log(response.data);
            setFadeIn(true);
            setTimeout(() => setFadeIn(false), 3000);

        } catch (error) {
            dispatch(chatFailure());
            console.log(error);
        } finally {
            clearInterval(interval);
            setLoadingMessage('');
        }
    }

    const containsTable = /\|.*\|/.test(response);
    return (
        <>
            <div className='w-full h-[100vh] flex flex-col'>
                <Topbar />
                <Chat />

                <div className='p-2 bg-secondary-200 flex items-center justify-center flex-col '>
                    <div className='flex items-center justify-center space-x-1 w-full'>
                        <textarea type='text' onChange={(e) => setPrompt(e.target.value)} value={prompt} placeholder='How Can I Help You ?' className='w-full p-1 rounded-se-md rounded-ss-md bg-secondary-100 focus:outline-none focus:shadow-sm focus:shadow-primary-100 text-white' />
                    </div>

                    <div className='flex flex-row items-center w-full justify-between bg-secondary-100 space-y-2 rounded-bl-md rounded-br-md p-2'>
                        <div className='flex items-center justify-center space-x-2'>
                            <button
                                className={`${links ? 'bg-primary-100 text-black border-primary-100 border' : 'border-black'} ${setting.context ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-100 hover:text-black'} border  rounded-full font-kanit px-3 py-1 text-white`}
                                onClick={() => setLinks(!links)}
                                disabled={setting.context}
                            >
                                Links
                            </button>
                            <button
                                className={`${qa ? 'bg-primary-100 text-black border-primary-100 border' : 'border-black'} border rounded-full font-kanit px-3 py-1 text-white ${setting.context ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-100 hover:text-black'}`}
                                onClick={() => setQA(!qa)}
                                disabled={setting.context}
                            >
                                Q&A
                            </button>
                            <button
                                className={`${setting.context ? 'bg-primary-100 text-black border-primary-100 border' : 'border-black'} ${qa ? 'cursor-not-allowed opacity-50' : 'hover-bg-primary-100 hover:text-black '} border hover:bg-primary-100  rounded-full font-kanit px-3 py-1 text-white`}
                                onClick={() => dispatch(setContext())}
                                disabled={qa}
                            >
                                Context
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
                        {chat.loading ?
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

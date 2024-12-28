import { useEffect, useState } from 'react'
import { Send, Cog } from 'lucide-react';
import client from '../service/axioxClient';
import Cube from '../components/Cube';
import { useSelector } from 'react-redux';
import { promptFailure, promptStart, promptSuccess } from '../app/Prompt/PromptSlice';
import { useDispatch } from 'react-redux';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Sidebar from '../components/Sidebar';



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
    const [prompt, setPrompt] = useState('')
    const [response, setResponse] = useState("");
    const [loadingMessage, setLoadingMessage] = useState('');
    const displayedLoadingMessage = useTypewriterEffect(loadingMessage, 50);
    const [fadeIn, setFadeIn] = useState(false);

    // Setting Button Drop Down 
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };


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
            const response = await client.post('/api/chat/gemini', { prompt })
            setPrompt('');
            // const text = response.data.response.candidates[0].content.parts[0].text;
            setResponse(response.data);
            dispatch(promptSuccess(response.data));
            console.log(response.data)
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
    console.log(response, "response")
    const containsTable = /\|.*\|/.test(response);
    return (
        <>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 12px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #888;
                    border-radius: 10px;
                    border: 3px solid #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                .fade-in {
                    animation: fadeIn 3s forwards; /* Adjust the duration of the fade-in effect */
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .fade-out {
                    animation: fadeOut 3s forwards; /* Adjust the duration of the fade-out effect */
                }
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
                .styled-table {
                    overflow-x: auto;
                    padding: 10px;
                    border-radius: 5px;
                }
                .styled-table table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .styled-table th, .styled-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    border-color: black; 
                }
                .styled-table th {
                    background-color: #212121;
                    color: white;
                    text-align: left;
                }
                    .transition-transform {
                    transition: transform 0.3s ease-in-out;
                }
                .translate-y-0 {
                    transform: translateY(0);
                }
                .-translate-y-full {
                    transform: translateY(-100%);
                }
            `}</style>
            {isSidebarVisible && (
                <div className={`fixed top-0 left-0 w-full transition-transform z-50 duration-300 ${isSidebarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                    <Sidebar toggleSidebar={toggleSidebar} />
                </div>
            )}
            <div className='w-full h-[100vh] flex flex-col'>
                <div className='bg-secondary-200 flex flex-row items-center justify-between'>
                    <div className='p-3  text-white font-kanit text-lg'>
                        Hello <span className='text-primary-100'>Tejasvi Bihari</span>
                    </div>
                    <div className='p-3 flex flex-row items-center justify-center space-x-2'>
                        <select className=' w-24 p-1 font-kanit rounded-full focus:outline-none focus:shadow-sm shadow-sm shadow-primary-100 text-white bg-secondary-100'>
                            <option>Auto</option>
                            <option>GPT</option>
                            <option>Gemini</option>
                        </select>
                        <div className='border border-secondary-200 p-1 rounded-md shadow-sm shadow-primary-100 cursor-pointer'>
                            <Cog onClick={toggleSidebar} className='text-gray-400' />
                        </div>
                    </div>

                </div>
                <div className='flex-grow p-4 overflow-auto custom-scrollbar'>
                    {/* Insert your additional content here */}
                    <div>
                        {response ? (
                            containsTable ? (
                                <div className={`styled-table ${fadeIn ? 'fade-in' : ''}`}>
                                    <Markdown remarkPlugins={[remarkGfm]}>{response}</Markdown>
                                </div>
                            ) : (
                                <p className={fadeIn ? 'fade-in' : ''}>
                                    <Markdown remarkPlugins={[remarkGfm]}>{response}</Markdown>
                                </p>
                            )
                        ) : (
                            <Cube className="z-10" />
                        )}
                    </div>
                    {loading &&
                        <p className='flex items-center justify-center font-kanit text-gray-400'>
                            {displayedLoadingMessage}
                        </p>
                    }

                </div>
                <form className='p-2 bg-secondary-200 flex items-center justify-center flex-col '>
                    <div className='flex items-center justify-center space-x-1 w-full'>
                        <input type='text' onChange={(e) => setPrompt(e.target.value)} value={prompt} placeholder='How Can I Help You ?' className='w-full p-1 rounded-md bg-secondary-100 focus:outline-none focus:shadow-sm focus:shadow-primary-100 text-white' />
                        <button onClick={handleSubmit} className='p-2 border-primary-100 border rounded-full bg-primary-200'>
                            <Send size={18} />
                        </button>
                    </div>
                    <span className='text-xs text-gray-400 font-kanit'>
                        Ai can make mistakes, so double-check it
                    </span>
                </form>

            </div>
        </>
    )
}

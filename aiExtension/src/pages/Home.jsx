import React, { useState } from 'react'
import { Send } from 'lucide-react';
import axios from 'axios';
import client from '../service/axioxClient';

export default function Home() {
    const [prompt, setPrompt] = useState('')
    const [response, setResponse] = useState("");

    const handleSubmit = async () => {
        try {
            const response = await client.post('/api/chat/gemini', { prompt })
            const text = response.data.response.candidates[0].content.parts[0].text;
            setResponse(text);
            console.log(text);
        } catch (error) {
            console.log(error);
        }
    }

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
            `}</style>
            <div className='w-full h-screen flex flex-col'>
                <div className='p-3 bg-secondary-200 text-white font-kanit text-lg'>
                    Hello <span className='text-primary-100'>Tejasvi Bihari</span>
                </div>
                <div className='flex-grow p-4 overflow-auto custom-scrollbar'>
                    {/* Insert your additional content here */}
                    {response}
                </div>
                <div className='flex items-center justify-center space-x-1 p-2 bg-secondary-200'>
                    <input type='text' onChange={(e) => setPrompt(e.target.value)} value={prompt} placeholder='How Can I Help You ?' className='w-full p-1 rounded-md bg-secondary-100 focus:outline-none focus:shadow-sm focus:shadow-primary-100 text-white' />
                    <button onClick={handleSubmit} className='p-2 border-primary-100 border rounded-full bg-primary-200'>
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </>
    )
}

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react';

export default function Sidebar({
    toggleSidebar,
    chat,
    setChat,
    fullPageScan,
    setFullPageScan,
    viewScan,
    setViewScan,
    socialMedia,
    setSocialMedia
}) {

    useEffect(() => {
        if (chat) {
            setFullPageScan(false);
            setViewScan(false);
            setSocialMedia(false);
        }
    })

    return (
        <>
            <div className='absolute w-full right-0 h-40 z-20'>
                <div className='bg-secondary-200 p-3 flex items-center justify-between'>
                    <span className="font-kanit text-white text-lg">
                        Settings
                    </span>
                    <div onClick={toggleSidebar} className='border border-secondary-200 p-1 rounded-md shadow-sm shadow-primary-100 cursor-pointer'>
                        <X className='text-gray-400' />
                    </div>
                </div>
                <div className="">
                    <ul className='flex flex-col items-center justify-center bg-secondary-100'>
                        <li className='border-b flex flex-row space-x-2 items-center justify-center border-secondary-200 font-kanit hover:text-white p-2 w-full text-center cursor-pointer hover:bg-gradient-to-t from-primary-200 via-primary-100 via-10% to-transparent to-80% transition-all ease-in'>
                            <input type='checkbox' id='chat' name='chat' onChange={(e) => setChat(e.target.checked)} checked={chat} className='custom-checkbox' />
                            <label htmlFor='chat' className='cursor-pointer'>Chat</label>
                        </li>
                        <li className='border-b flex flex-row space-x-2 items-center justify-center border-secondary-200 font-kanit hover:text-white p-2 w-full text-center hover:bg-gradient-to-t from-primary-200 via-primary-100 via-10% to-transparent to-80% transition-all ease-in'>
                            <input type='checkbox' id='fullScan' name='fullScan' onChange={(e) => setFullPageScan(e.target.checked)} checked={fullPageScan} className={`custom-checkbox ${chat ? "text-secondary-200" : "text-black"}`} disabled={chat == true} />
                            <label htmlFor='fullScan' className={`${chat ? "text-secondary-200" : "text-black cursor-pointer"}`}>Full Page Scan</label>
                        </li>
                        <li className='border-b flex flex-row space-x-2 items-center justify-center border-secondary-200 font-kanit hover:text-white p-2 w-full text-center cursor-pointer hover:bg-gradient-to-t from-primary-200 via-primary-100 via-10% to-transparent to-80% transition-all ease-in'>
                            <input type='checkbox' id='viewScan' name='viewScan' onChange={(e) => setViewScan(e.target.checked)} checked={viewScan} className='custom-checkbox' disabled={chat == true} />
                            <label htmlFor='viewScan' className={`${chat ? "text-secondary-200" : "text-black cursor-pointer"}`}>View Page Scan</label>
                        </li>
                        <li className='border-b flex flex-row space-x-2 items-center justify-center border-secondary-200 font-kanit hover:text-white p-2 w-full text-center cursor-pointer hover:bg-gradient-to-t from-primary-200 via-primary-100 via-10% to-transparent to-80% transition-all ease-in'>
                            <input type='checkbox' id='socialMedia' name='socialMedia' onChange={(e) => setSocialMedia(e.target.checked)} checked={socialMedia} className='custom-checkbox' disabled={chat == true} />
                            <label htmlFor='socialMedia' className={`${chat ? "text-secondary-200" : "text-black cursor-pointer"}`}>Social Media Scan</label>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

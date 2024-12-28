import React from 'react'
import { X } from 'lucide-react';

export default function Sidebar({ toggleSidebar }) {
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
                        <li className='border-b flex flex-row space-x-2 items-center justify-center border-secondary-200 font-kanit hover:text-white  p-2 w-full text-center cursor-pointer hover:bg-gradient-to-t from-primary-200  via-primary-100 via-10% to-transparent to-80% transition-all ease-in'>
                            <input type='checkbox' id='social-media' name='option' className='' />
                            <label htmlFor='social-media' className='cursor-pointer'>Social Media</label>
                        </li>
                        <li className='border-b border-secondary-200 font-kanit hover:text-white  p-2 w-full text-center cursor-pointer hover:bg-gradient-to-t from-primary-200  via-primary-100 via-10% to-transparent to-80% transition-all ease-in'>
                            Full Page
                        </li>
                        <li className='border-b border-secondary-200 font-kanit hover:text-white  p-2 w-full text-center cursor-pointer hover:bg-gradient-to-t from-primary-200  via-primary-100 via-10% to-transparent to-80% transition-all ease-in'>
                            View Port
                        </li>

                    </ul>
                </div>
            </div>
        </>
    )
}

import React from 'react'
import Signin from '../components/Signin'
import { useState } from 'react';
import Signup from '../components/Signup';
import SetName from '../components/SetName';

export default function Auth() {
    return (
        <>
            <div className='bg-secondary-200 p-4 h-screen mx-auto items-center justify-center flex flex-col'>
                <SetName />
            </div>
        </>
    )
}

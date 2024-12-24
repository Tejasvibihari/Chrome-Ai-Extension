import React from 'react'
import Signin from '../components/Signin'
import { useState } from 'react';
import Signup from '../components/Signup';

export default function Auth() {
    const [haveAccount, setHaveAccount] = useState(false);


    const handleAccount = () => {
        setHaveAccount(!haveAccount);
    }
    return (
        <>
            <div className='bg-secondary-200 p-4 h-screen mx-auto items-center justify-center flex flex-col'>

                {haveAccount ? <Signup /> : <Signin />}
                <div className='text-center  text-secondary-100  font-kanit flex flex-row space-x-2 items-center- justify-center my-2'>
                    <span> {haveAccount ? "Don't have an account?" : "Have an account?"}</span>
                    <span onClick={handleAccount} className='cursor-pointer text-primary-300 font-semibold'>
                        {haveAccount ? "Sign Up Here" : " Sign In here!"}
                    </span>
                </div>
            </div>
        </>
    )
}

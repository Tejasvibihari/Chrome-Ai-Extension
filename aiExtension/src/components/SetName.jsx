import { CircleUserRound, Mail, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setName } from '../app/Auth/AuthSlice';

export default function SetName() {
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState("");

    const handleSignIn = (e) => {
        e.preventDefault();
        try {
            dispatch(setName(firstName))
            console.log("Success")
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className='w-full'>
            <h1 className='text-2xl font-semibold font-kanit text-primary-300 my-4 text-center flex items-center justify-center space-x-2'>
                <CircleUserRound /><span> What is Your Name ?</span>
            </h1>
            <div className='bg-secondary-100 shadow-sm shadow-primary-100 rounded-md p-4'>
                <form className='flex flex-col space-y-2'>
                    <label className='text-white flex flex-row items-center space-x-2'>
                        <Mail size={20} /><span>First Name</span>
                    </label>
                    <input
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        type="text"
                        name="email"
                        id="email"
                        placeholder='Bihari'
                        className='w-full p-1 rounded-md shadow-md focus:shadow-primary-100 focus:outline-none'
                    />
                    <button
                        onClick={handleSignIn}
                        type='submit'
                        className='w-full font-kanit text-white bg-primary-300 p-2 rounded-md shadow-md hover:shadow-primary-100 focus:outline-none hover:bg-primary-100 transition-colors ease-linear hover:text-primary-500 hover:font-semibold'
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}
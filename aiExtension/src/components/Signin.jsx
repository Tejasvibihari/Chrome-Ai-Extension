import { CircleUserRound, Mail, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setName } from '../app/Auth/AuthSlice';

export default function Signin() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleSignIn = (e) => {
        e.preventDefault();
        try {
            dispatch(setName(formData))
            console.log("Success")
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    }

    return (
        <div className='w-full'>
            <h1 className='text-2xl font-semibold font-kanit text-primary-300 my-4 text-center flex items-center justify-center space-x-2'>
                <CircleUserRound /><span> Sign In</span>
            </h1>
            <div className='bg-secondary-100 shadow-sm shadow-primary-100 rounded-md p-4'>
                <div className='flex flex-col space-y-2'>
                    <label className='text-white flex flex-row items-center space-x-2'>
                        <Mail size={20} /><span>Email</span>
                    </label>
                    <input
                        onChange={handleChange}
                        value={formData.email}
                        type="email"
                        name="email"
                        id="email"
                        placeholder='example@gmail.com'
                        className='w-full p-1 rounded-md shadow-md focus:shadow-primary-100 focus:outline-none'
                    />
                    <label className='text-white flex flex-row items-center space-x-2'>
                        <Lock size={20} /><span>Password</span>
                    </label>
                    <input
                        onChange={handleChange}
                        value={formData.password}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        className='w-full p-1 rounded-md shadow-md focus:shadow-primary-100 focus:outline-none'
                    />
                    <button
                        onClick={handleSignIn}
                        className='w-full font-kanit text-white bg-primary-300 p-2 rounded-md shadow-md hover:shadow-primary-100 focus:outline-none hover:bg-primary-100 transition-colors ease-linear hover:text-primary-500 hover:font-semibold'
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}
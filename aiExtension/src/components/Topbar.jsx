import { Cog } from 'lucide-react';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setModel } from '../app/Setting/SettingSlice';

export default function Topbar() {
    const name = useSelector(state => state.auth.name);
    const model = useSelector(state => state.setting.model);
    const dispatch = useDispatch();
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [chat, setChat] = useState(false);
    const [fullPageScan, setFullPageScan] = useState(false);
    const [viewScan, setViewScan] = useState(false);
    const [socialMedia, setSocialMedia] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const handleModelChange = (e) => {
        dispatch(setModel(e.target.value));
    };

    return (
        <>
            {isSidebarVisible && (
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
            )}
            <div className='bg-secondary-200 flex flex-row items-center justify-between'>
                <div className='p-3 flex flex-row space-x-2 text-white font-kanit text-lg'>
                    <span>
                        Hello
                    </span>
                    <span className='text-primary-100'>{name}</span>
                </div>
                <div className='p-3 flex flex-row items-center justify-center space-x-2'>
                    <select
                        onChange={handleModelChange}
                        value={model}
                        className='w-28 p-1 font-kanit rounded-full focus:outline-none focus:shadow-sm shadow-sm shadow-primary-100 text-white bg-secondary-100'>
                        <option value="Auto">Auto</option>
                        <option value="gpt">GPT</option>
                        <option value="Gemini">Gemini</option>
                        <option value="Deepseek">Deepseek</option>
                    </select>
                    <div className='border border-secondary-200 p-1 rounded-md shadow-sm shadow-primary-100 cursor-pointer'>
                        <Cog onClick={toggleSidebar} className='text-gray-400' />
                    </div>
                </div>
            </div>
        </>
    );
}
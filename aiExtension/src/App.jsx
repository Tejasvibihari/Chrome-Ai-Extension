import React from 'react'
import { useState, useEffect } from 'react'

export default function App() {

  const [scrapedData, setScrapedData] = useState('');

  useEffect(() => {
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "updateSidebar") {
        console.log('message', message)
        console.log("Hello from the background script");
        setScrapedData(message.data.text);
      }
    });
  }, []);

  return (
    <>
      <div className='p-4 bg-black text-white'>
        {scrapedData ? scrapedData : 'Loading...'}
        Hello
      </div>
    </>
  )
}

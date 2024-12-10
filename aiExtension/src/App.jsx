import React, { useState, useEffect } from 'react';

export default function App() {
  const [scrapedData, setScrapedData] = useState('');
  const [tabUrl, setTabUrl] = useState('');

  useEffect(() => {
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "updateSidebar") {
        console.log('Message from Background Script:', message); // Log the message
        setScrapedData(message.data.text);
        setTabUrl(message.data.url);
        console.log('Tab URL from App.js:', message.data.url);
      }
    });
  }, []);

  return (
    <>
      <div className='p-4 bg-black text-white'>
        {scrapedData ? scrapedData : 'Loading...'}
        <br />
        {tabUrl ? `Tab URL: ${tabUrl}` : ''}
        Hello
      </div>
    </>
  );
}
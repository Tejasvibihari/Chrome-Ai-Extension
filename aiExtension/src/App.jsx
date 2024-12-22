import React, { useState, useEffect } from 'react';

export default function App() {
  const [scrapedData, setScrapedData] = useState('');
  const [tabUrl, setTabUrl] = useState('');
  const [wdata, setWdata] = useState('');

  useEffect(() => {
    // Function to get the current tab's URL
    const getCurrentTabUrl = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const url = tabs[0].url;
          setTabUrl(url);
          console.log('Initial Tab URL:', url);
        }
      });
    };

    // Get the current tab's URL when the component mounts
    getCurrentTabUrl();

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "updateSidebar") {
        console.log('Message from Background Script:', message); // Log the message
        setScrapedData(message.data.text);
        setTabUrl(message.data.url);
        setWdata(message.data.wdata);
        console.log('Tab URL from App.js:', message.data.url);
        console.log('Whole Data Line 31:', message.data.wdata);
      }
    });
  }, []);

  return (
    <>
      <div className='p-4 bg-black text-white h-screen flex justify-center items-center'>
        {scrapedData ? scrapedData : 'Loading...'}
        <br />
        {tabUrl ? `Tab URL: ${tabUrl}` : ''}
        {wdata ? `Whole Data: ${wdata}` : ''}
      </div>
    </>
  );
}
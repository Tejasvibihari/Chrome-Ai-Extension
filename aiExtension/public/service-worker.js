// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    await chrome.sidePanel.setOptions({
        tabId,
        path: 'index.html',
        enabled: true
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startScraping") {
        console.log('Starting scraping...');

        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            const tabUrl = tabs[0].url
            console.log('Tab URL:', tabUrl);
            // Send the URL to the React frontend
            chrome.runtime.sendMessage({ action: 'sendURL', url: tabUrl });
            sendResponse({ success: true, url: tabUrl });
        });

        return true; // Keep the message channel open for async response
    }
});

// if (tabs.length > 0) {
//     const tab = tabs[0];
//     console.log('Tab URL:', tab.url);
// Send a message to the content script to invoke the function


// // Execute the content script
// chrome.scripting.executeScript({
//     target: { tabId: tabs[0].id },
//     files: ['content.js']
// }, async () => {
//     if (chrome.runtime.lastError) {
//         console.error('Injection failed:', chrome.runtime.lastError, "Hello");
//         sendResponse({ success: false, error: chrome.runtime.lastError.message });
//         return;
//     }

//     // Send message to content script after injection
//     chrome.tabs.sendMessage(tabs[0].id, { action: "scrapedData" }, (response) => {
//         if (!response) {
//             sendResponse({ success: false, error: "No response from content script" });
//             return;
//         }

//         // Here you'll get the scraped data
//         console.log("Scraped data:", response.data);
//         sendResponse({ success: true, data: response.data });
//     });
// });
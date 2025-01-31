

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));


// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === "") {
//         console.log('Received Scraped Data:', message.data); // Log the received data
//         // Relay the message to the React component
//         chrome.runtime.sendMessage({ type: "updateSidebar", data: message.data });
//     } else {
//         console.log('No message received');
//     }
// });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startScraping") {
        console.log('Starting scraping From Service Js...');

        // Get the URL of the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const tab = tabs[0];
                console.log('Tab URL:', tab.url);

                // Perform the scraping

            } else {
                console.error('No active tab found');
                // sendResponse({ success: false, error: 'No active tab found' });
            }
        });

        return true; // Indicate that the response is asynchronous
    }
});
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    // if (!tab.url) return;
    // Always enable the side panel with index.html
    // Log the URL of the tab

    await chrome.sidePanel.setOptions({
        tabId,
        path: 'index.html',
        enabled: true
    });
});



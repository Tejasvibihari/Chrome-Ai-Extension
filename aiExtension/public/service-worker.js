

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "scrapedData") {
        console.log('Received Scraped Data:', message.data); // Log the received data
        // Relay the message to the React component
        chrome.runtime.sendMessage({ type: "updateSidebar", data: message.data });
    } else {
        console.log('No message received');
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;
    // Always enable the side panel with index.html
    // Log the URL of the tab
    console.log('Tab URL: From Service-worker js', tab.url);
    console.log('Tab URL from service worker empty check:');


    await chrome.sidePanel.setOptions({
        tabId,
        path: 'index.html',
        enabled: true
    });
});



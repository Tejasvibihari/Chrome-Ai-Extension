
// const GOOGLE_ORIGIN = 'https://biharilibrary.in';

// // Allows users to open the side panel by clicking on the action toolbar icon
// chrome.sidePanel
//     .setPanelBehavior({ openPanelOnActionClick: true })
//     .catch((error) => console.error(error));

// chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
//     if (!tab.url) return;
//     const url = new URL(tab.url);
//     // Enables the side panel on google.com
//     if (url.origin === GOOGLE_ORIGIN) {
//         await chrome.sidePanel.setOptions({
//             tabId,
//             path: 'index.html',
//             enabled: true
//         });
//     } else {
//         // Disables the side panel on all other sites
//         await chrome.sidePanel.setOptions({
//             tabId,
//             enabled: false
//         });
//     }
// });

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;
    // Always enable the side panel with index.html
    // Log the URL of the tab
    console.log('Tab URL:', tab.url);
    console.log('Tab URL');
    await chrome.sidePanel.setOptions({
        tabId,
        path: 'index.html',
        enabled: true
    });
});



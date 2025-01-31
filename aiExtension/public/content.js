
// function scrapePage() {
//     const tabUrl = window.location.href;
//     const wholeData = document;
//     const textContent = "Content Js is working";
//     return {
//         text: textContent,
//         url: tabUrl,
//         wdata: wholeData
//     };
// }

// Function to send the scraped data to the background script
// function sendScrapedData() {
//     const scrapedData = scrapePage();
//     chrome.runtime.sendMessage({ type: "scrapedData", data: scrapedData });
// }



// // Observe changes in the DOM
// const observer = new MutationObserver((mutations) => {
//     mutations.forEach((mutation) => {
//         setTimeout(() => {
//             sendScrapedData();
//         }, 3000);
//     });
// });

// Start observing the document for changes
// observer.observe(document, { childList: true, subtree: true });

// Initial scrape and send data
// sendScrapedData();


// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "startScraping") {
//         console.log('Starting scraping from Content js...');
//         fetch('http://localhost:5000/scrape', { method: 'POST' })
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Scraped Data:', data);
//                 // Send the data back to the sender if needed
//                 sendResponse({ success: true, data });
//             })
//             .catch(error => {
//                 console.error('Scraping failed:', error);
//                 sendResponse({ success: false, error });
//             });
//         console.log('Scraping done');
//         return true; // Indicate that the response is asynchronous
//     }
// });
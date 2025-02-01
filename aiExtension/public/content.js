
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

// Function to scrape the website data
// Function to scrape the website data
// content.js



// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log("Scraping data from content.js");

//     if (message.action === "scrapeData") {
//         console.log("Scraping data from content.js");

//         // Your scraping logic here
//         const title = document.querySelector('h1')?.innerText || 'No title found';
//         const content = document.body.innerText.substring(0, 1000); // Example

//         // Send data back to service worker
//         chrome.runtime.sendMessage({
//             action: "scrapedData",
//             data: "Hello This is Data from Content Js"
//         });
//     }
// });

function getTitle() {
    let title = document.querySelector('h1')?.innerText || 'No title found';
    let content = document.body.innerText.substring(0, 1000); // Example
    // change the color of content to red
    // document.body.style.color = "red";

    console.log(title);
    console.log(content);
}

let title = document.querySelector('h1')?.innerText || 'No title found';
let content = document.body.innerText.substring(0, 1000); // Example
// change the color of content to red
document.body.style.color = "red";

console.log(title);
console.log(content);
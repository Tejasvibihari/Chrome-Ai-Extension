
function scrapePage() {
    const tabUrl = window.location.href;
    const wholeData = document;

    const data = Array.from(document.querySelectorAll('p')).map(p => p.textContent);
    const hello = Array.from(document.querySelectorAll('span')).map(p => p.textContent);
    console.log("Hello from content.js", data);
    console.log("Hello from content.js", hello);
    // console.log('Tab URL from contentjs line number 5:', tabUrl); // Log the URL of the tab
    const textContent = "Content Js is working";
    // console.log('Tab Data from contentjs line number 6:', wholeData.getElementsByTagName('body')); // Log the URL of the tab// Log the URL of the tab

    return {
        text: textContent,
        url: tabUrl,
        wdata: wholeData
    };
}

// Function to send the scraped data to the background script
function sendScrapedData() {
    const scrapedData = scrapePage();
    chrome.runtime.sendMessage({ type: "scrapedData", data: scrapedData });
}



// // Observe changes in the DOM
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        setTimeout(() => {
            sendScrapedData();
        }, 3000);
    });
});

// Start observing the document for changes
observer.observe(document, { childList: true, subtree: true });

// Initial scrape and send data
sendScrapedData();
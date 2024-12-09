function scrapePage() {
    // const textContent = document.body.innerText;
    // console.log('Scraped Data:', textContent); // Log the scraped data
    const tabUrl = window.location.href;
    console.log('Tab URL from contentjs line number 5:', tabUrl); // Log the URL of the tab




    return {
        text: textContent
    };
}

// Send the scraped data to the background script
const scrapedData = scrapePage();
chrome.runtime.sendMessage({ type: "scrapedData", data: scrapedData });


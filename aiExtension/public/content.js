function scrapePage() {
    const tabUrl = window.location.href;
    console.log('Tab URL from contentjs line number 5:', tabUrl); // Log the URL of the tab

    const textContent = "Content Js is working";

    return {
        text: textContent,
        url: tabUrl
    };
}

// Send the scraped data to the background script
const scrapedData = scrapePage();
chrome.runtime.sendMessage({ type: "scrapedData", data: scrapedData });
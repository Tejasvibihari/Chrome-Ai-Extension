import puppeteer from 'puppeteer';
import dotenv from "dotenv";
import OpenAI from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { aiPrompt } from './summarizationPrompt.js';
// console.log(aiPrompt);
dotenv.config();
const OpenAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const webScrape = async (req, res) => {
    const { url, links, model, qa } = req.body;
    console.log(req.body);
    try {
        let allLinks = [];
        if (links === true) {
            // Get All The link From Web Page 
            allLinks = await getLinks(url);
            res.json({ role: "Link", content: allLinks });
            return;

        } else {
            // Step 1 :- Get The Data From Website 
            console.log("Scraping Started....")
            const rawData = await scrapeData(url);
            console.log("Hello Scraping Done....")
            // Step 2 :- Remove All Unwanted Stuff from Scraped Data 
            console.log("Filtering Started....")
            const filteredData = await filterContent(rawData);
            console.log("Filtering Done....")
            // Step 3 :- Summarize The Data filtered Data
            console.log("Summarizing Started....")
            const summarizedData = await summarizeData(model, filteredData);
            console.log("Graph Creation Started....")
            const graphData = await createGraph(filteredData);
            if (qa) {
                console.log("QA Started......")
                const qaResponse = await handleQa(summarizedData, model);
                res.json({ role: "Ai", content: qaResponse });
            }
            console.log("Scraping Done....")
            console.log(summarizeData, "Response Data")

            res.json({ role: "Ai", content: summarizedData, graph: graphData });
        }

    } catch (error) {
        console.log(error);
    }
}



// Gpt Function 
const gpt = async (prompt) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                },
            ],
        });
        // console.log(completion.choices[0].message.content)
        return completion.choices[0].message.content;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// Gemini Function 
const gemini = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        // console.log(result.response.text());
        // res.json(result.response.text());
        return result.response.text();
    } catch (error) {
        console.log(error);
        return error;
    }
}

const getLinks = async (url) => {
    try {
        let links = [];
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch();
        // Create New Page Or New Tab To Open The Url 
        const page = await browser.newPage();
        // Go To Target Website 
        const timeout = 100000;
        await page.goto(url, { timeout });

        links = await page.$$eval('a', anchors =>
            anchors.map(anchor => ({
                text: anchor.innerText.trim(),  // the visible text of the link
                href: anchor.href                // the link URL
            }))
        );
        return links;
    } catch (error) {
        console.log(error);
        return error;
    }
}
const scrapeData = async (url) => {
    try {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch();
        // Create New Page Or New Tab To Open The Url 
        const page = await browser.newPage();
        // Go To Target Website 
        const timeout = 100000;
        await page.goto(url, { timeout });
        const textContent = await page.evaluate(() => document.body.innerText);
        // Get All The link From Web Page 

        await browser.close();
        return textContent;
    } catch (error) {
        console.error('Error during web scraping:', error);
        if (browser) {
            await browser.close();
        }
        return error;
    }
}

const filterContent = async (rawData) => {
    try {
        // Prompt Generation For Ads Removal 
        const adsRemovePrompt = `
         You are an AI that filters webpage content by removing unnecessary elements without modifying the original content.
    **Remove only the following elements:**
    ✅ Advertisements (banners, pop-ups, sponsored sections, promotional content)
    ✅ Buttons (e.g., "Subscribe", "Sign up", "Read more", "Download", "Try for free", etc.)
    ✅ Comments section (user-generated comments, discussions, forums, or any replies)

    **Do NOT:**
    ❌ Do not summarize, rewrite, or change the original content.
    ❌ Do not modify headings, paragraphs, lists, or tables.
    ❌ Do not alter the meaning or structure of the content.

    **Given the following webpage content, return the same content with only the unnecessary elements removed:**

    ${rawData}`;

        const filterData = await gemini(adsRemovePrompt);
        return filterData
    } catch (error) {
        console.log("Error Dusing filtering Data :", error)
        return error;
    }

}

const summarizeData = async (model, filteredData) => {
    try {
        const summarizationPrompt = `You are an AI assistant that accurately summarizes user-provided content while ensuring that no key points are missed. 
The content comes from various sources, such as blogs, news articles, documentation, or other informative materials.

Your Objective:
- Extract and present the **core information** in a **concise and structured** format.
- **Do NOT remove or alter** any **important details** from the original content.
- **Add** insights, assumptions, or new information.
- Ensure the summary is **clear, easy to read, and preserves the meaning** of the original text.
 Guidelines for Summarization:
Keep all key facts, numbers, names, and essential points
Maintain the original intent and meaning** of the content.
Exclude any unnecessary repetition, filler words, or redundant details.
Use simple, structured formatting (e.g., bullet points, headings, or short paragraphs) for readability.

### Content to Summarize:
${filteredData}

### Expected Output:
- A **well-structured summary** that captures all important points.
- **No missing key details, Add Extra Content for better understanding.**
 `;
        if (model === "gpt") {
            console.log("GPT Model Selected");
            const response = await gpt(summarizationPrompt);
            console.log(response);
            return response;
        }
        else if (model === "gemini") {
            console.log("Gemini Model Selected");
            const response = await gemini(summarizationPrompt);
            console.log(response);
            return response;
        } else {
            console.log("Both Models Selected");
            const response = await gemini(summarizationPrompt);
            console.log(response);
            return response;
        }

    } catch (error) {
        console.log("Error During Summerizing the Data :", error);
        return error;
    }
}

const handleQa = async (data, model) => {
    try {
        const qaPrompt = `
        Please process the following set of questions:
        1. First, categorize each question as either multiple-choice or subjective.
        2. Then answer each question in its appropriate format:
        - For multiple-choice questions: Select the correct option (A, B, C, or D) and briefly explain your choice.
        - For subjective questions: Provide a complete answer in simple, clear language.
        Questions:
       ${data}
`
        if (model === "gpt") {
            console.log("GPT Model Selected");
            const response = await gpt(qaPrompt);
            console.log(response);
            return response;
        }
        else if (model === "gemini") {
            console.log("Gemini Model Selected");
            const response = await gemini(qaPrompt);
            console.log(response);
            return response;
        } else {
            console.log("Both Models Selected");
            const response = await gpt(qaPrompt);
            console.log(response);
            return response;
        }
    } catch (error) {
        console.log(error);
    }
}

const createGraph = async (data) => {
    try {
        const graphPrompt = `
         Analyze the given data and generate structured graph data in **D3.js-compatible JSON format**.
        Ensure that the response contains **1 to 3 charts** (depending on the dataset) and provides meaningful insights.
        Each chart must include:
        - **chartTitle**: Title of the chart.
        - **chartType**: Type of chart (e.g., "bar", "line", "pie", "hierarchy").
        - **description**: Brief description of the chart.
        - **data**: Structured data for visualization.
        - **labels**: (For pie charts) Category labels.
        - **xAxisLabel**, **yAxisLabel**: Labels for bar/line charts.
        - if there no relevent data to create graph Just return The resopnse like No Graph Is Possible to create
        Here is the required data:
        ${data}
        Example JSON response:
        {
          "charts": [
            {
              "chartTitle": "Website Traffic Over Time",
              "chartType": "line",
              "description": "Daily visitor count on the website.",
              "xAxisLabel": "Date",
              "yAxisLabel": "Visitors",
              "data": [
                { "date": "2024-03-20", "visitors": 120 },
                { "date": "2024-03-21", "visitors": 150 }
              ]
            },
            {
              "chartTitle": "User Engagement by Category",
              "chartType": "pie",
              "description": "Percentage of user interactions.",
              "labels": ["Blog Reads", "Product Views", "Sign-ups", "Purchases"],
              "data": [50, 30, 10, 10]
            }
          ]
        }
        `
        const response = await gpt(graphPrompt);
        console.log(response);
        return response;


    } catch (error) {
        console.log(error);
    }
}
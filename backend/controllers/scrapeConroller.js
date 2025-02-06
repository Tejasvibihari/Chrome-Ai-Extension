import puppeteer from 'puppeteer';
import dotenv from "dotenv";
import OpenAI from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const OpenAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const webScrape = async (req, res) => {
    const { url, link, model } = req.body;
    console.log('Url:', url);
    try {
        let links = [];
        // Step 1 :- Get The Data From Website 
        console.log("Sraping Started....")
        const rawData = await scrapeData(url);
        console.log("Sraping Done....")
        // Step 2 :- Revove All Unwanted Stuff from Scraped Data 
        console.log("Filtering Started....")
        const filteredData = await filterContent(rawData);
        console.log("Filtering Done....")
        // Step 3 :- Summarize The Data filtered Data
        console.log("Summarizing Started....")
        const summarizedData = await summarizeData(model, filteredData);
        console.log("Sraping Done....")
        // Get All The link From Web Page 
        // if (link) {
        //     links = await page.$$eval('a', anchors =>
        //         anchors.map(anchor => ({
        //             text: anchor.innerText.trim(),  // the visible text of the link
        //             href: anchor.href                // the link URL
        //         }))
        //     );
        // }
        // console.log(geminiOutput);
        res.json({ summarizedData });
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
        console.log(completion.choices[0].message.content)
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
        console.log(result.response.text());
        // res.json(result.response.text());
        return result.response.text();
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
        const summarizationPrompt = `
You are an AI assistant that accurately summarizes user-provided content while ensuring that no key points are missed. 
The content comes from various sources, such as blogs, news articles, documentation, or other informative materials.

Your Objective:
- Extract and present the **core information** in a **concise and structured** format.
- **Do NOT remove or alter** any **important details** from the original content.
- **Do NOT add** any AI-generated insights, assumptions, or new information.
- Ensure the summary is **clear, easy to read, and preserves the meaning** of the original text.
 Guidelines for Summarization:
Keep all key facts, numbers, names, and essential points
Maintain the original intent and meaning** of the content.
Exclude any unnecessary repetition, filler words, or redundant details.
Do NOT add external explanations, opinions, or extra context  beyond what is provided.
Use simple, structured formatting (e.g., bullet points, headings, or short paragraphs) for readability.

### Content to Summarize:
${filteredData}

### Expected Output:
- A **well-structured summary** that captures all important points.
- **No missing key details, no extra AI-generated content.**
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
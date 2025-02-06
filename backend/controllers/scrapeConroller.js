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
    const { url, link } = req.body;
    console.log('Url:', url);
    try {
        // Launch the browser and open a new blank page
        let links = [];
        const browser = await puppeteer.launch();
        // Create New Page Or New Tab To Open The Url 
        const page = await browser.newPage();
        // Go To Target Website 
        const timeout = 100000;
        await page.goto(url, { timeout });
        const textContent = await page.evaluate(() => document.body.innerText);

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

    ${textContent}`;

        const geminiOutput = await gpt(adsRemovePrompt)



        // Get All The link From Web Page 
        if (link) {
            links = await page.$$eval('a', anchors =>
                anchors.map(anchor => ({
                    text: anchor.innerText.trim(),  // the visible text of the link
                    href: anchor.href                // the link URL
                }))
            );
        }
        console.log(geminiOutput);
        await browser.close();
        res.json({ geminiOutput });


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


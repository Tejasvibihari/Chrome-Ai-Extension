import dotenv from "dotenv";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const OpenAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const openai = new OpenAI({
    apiKey: OpenAI_API_KEY,
});
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const chat = async (req, res) => {
    const { model, prompt, context, contextData } = req.body;
    // console.log("Model:", model, "Context:", context, "Prompt:", prompt, "Context Data:", contextData);

    try {
        let structuredPrompt;
        let response;
        structuredPrompt = {
            context: "The following is the scraped data from a website. Use this information as the primary reference to answer the user's question.",
            scraped_data: contextData,
            user_question: prompt,
            instructions: "Use the provided scraped data as the main source. If the user's question requires additional context, infer the most logical answer. If information is missing, state that clearly but try to provide helpful insights. If no context is provided, generate the answer based solely on the user's question."
        };
        let normalchat = {
            role: "user",
            content: prompt
        };
        if (!context) {
            console.log("No Context Provided");
            if (model === "gpt") {
                console.log("GPT Model Selected");
                response = await gpt(JSON.stringify(normalchat));  // Convert object to string
            } else if (model === "gemini") {
                console.log("Gemini Model Selected");
                response = await gemini(prompt);
            } else {
                console.log("Both Models Selected (Using Gemini)");
                response = await gemini(prompt);
            }
        }

        if (context) {
            console.log("Context Provided");
            if (model === "gpt") {
                console.log("GPT Model Selected");
                response = await gpt(JSON.stringify(structuredPrompt));  // Convert object to string
            } else if (model === "gemini") {
                console.log("Gemini Model Selected");
                response = await gemini(structuredPrompt);
            } else {
                console.log("Both Models Selected (Using Gemini)");
                response = await gemini(structuredPrompt);
            }
        }

        console.log("AI Response:", response);
        res.json({ role: "Ai", content: response });

    } catch (error) {
        console.error("Error in chat function:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// GPT Function
const gpt = async (prompt) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("GPT Error:", error);
        return "Error generating response from GPT.";
    }
};

// Gemini Function
const gemini = async (prompt) => {
    try {
        // Ensure the input is an array
        const result = await model.generateContent([JSON.stringify(prompt)]);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Error generating response from Gemini.";
    }
};

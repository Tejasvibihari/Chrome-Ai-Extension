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

    export const chat = async (req, res) => {
        const { model, type, prompt, context } = req.body;
        console.log(model, type, prompt);
        try {
            const structuredPrompt = {
                context: "The following is the scraped data from a website. Use this information as the primary reference to answer the user's question.",
                scraped_data: context,
                user_question: prompt,
                instructions: "Use the provided scraped data as the main source. If the user's question requires additional context, infer the most logical answer. If information is missing, state that clearly but try to provide helpful insights. And if the context is not given to you then generate the answer based on the user's question only."
            };
            if (model === "gpt") {
                console.log("GPT Model Selected");
                const response = await gpt(structuredPrompt);
                console.log(response);
                res.json({ role: "Ai", content: response });
            }
            else if (model === "gemini") {
                console.log("Gemini Model Selected");
                const response = await gemini(structuredPrompt);
                console.log(response);
                res.json({ role: "Ai", content: response });
            } else {
                console.log("Both Models Selected");
                const response = await gemini(structuredPrompt);
                console.log(response);
                res.json({ role: "Ai", content: response });
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

import express from 'express';
import dotenv from "dotenv";
import OpenAI from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get('/api/chat', async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            "type": "text",
                            "text": "Difference Between Input and output device with parameter"
                        }
                    ]
                },
            ],
        });
        console.log(completion)
        res.json(completion);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong!');
    }
});


app.get('/api/chat/gemini', async (req, res) => {
    try {
        const prompt = "Difference Between Input and output device with parameter";

        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        console.log(result);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong!');
    }
});



app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
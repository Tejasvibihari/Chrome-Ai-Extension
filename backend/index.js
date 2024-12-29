import express from 'express';
import dotenv from "dotenv";
import OpenAI from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors';
import mongoose from 'mongoose';

import authRouter from './router/authRoute.js';

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());

app.use(cors());

// Mongoose Connection 
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log(error);
    });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;
    console.log(prompt);
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
        res.json(completion.choices[0].message.content);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong!');
    }
});


app.post('/api/chat/gemini', async (req, res) => {
    const { prompt } = req.body;
    console.log(prompt);
    try {
        // const prompt = "Difference Between Input and output device with parameter";

        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        console.log(result);
        res.json(result.response.text());

    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong!');
    }
});



app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use("/api/v0/auth", authRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
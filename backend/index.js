import express from 'express';
import dotenv from "dotenv";
import OpenAI from 'openai';

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.get('/api/chat', async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            "type": "image",
                            "text": "What is Blockchain"
                        }
                    ]
                },
            ],
        });

        res.json(completion);
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
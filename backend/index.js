import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import mongoose from 'mongoose';

import authRouter from './router/authRoute.js';
import chatRouter from './router/chatRouter.js';
import scrapeRouter from './router/scrapeRouter.js';
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

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use("/api/v0/auth", authRouter);
app.use("/api/v0/chat", chatRouter);
app.use("/api/v0/scrape", scrapeRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
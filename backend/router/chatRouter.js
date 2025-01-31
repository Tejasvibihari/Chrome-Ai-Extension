import express from 'express';
import { chat } from '../controllers/aiController.js';

const router = express.Router();

router.post("/gpt-4o-mini", chat)


export default router;
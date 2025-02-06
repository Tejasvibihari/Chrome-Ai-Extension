import express from 'express';
import { webScrape } from '../controllers/scrapeConroller.js';

const router = express.Router();

router.post('/webscrape', webScrape);

export default router;
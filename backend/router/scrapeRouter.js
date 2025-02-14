import express from 'express';
import { webScrape } from '../controllers/scrapeConroller.js';

const router = express.Router();

router.post('/webscrape', webScrape);
// router.post('/generateimage', generateImage);

export default router;
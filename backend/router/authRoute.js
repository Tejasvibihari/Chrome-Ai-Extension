import express from 'express';
import { checkUserName, Login, Register } from '../controllers/authController.js';

const router = express.Router();

router.post('/checkusername', checkUserName);
router.post('/register', Register);
router.post('/login', Login);

export default router;
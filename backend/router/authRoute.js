import express from 'express';
import { checkUserName, Login, Register, verifyEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/checkusername', checkUserName);
router.post('/register', Register);
router.post('/login', Login);
router.post('/verifyemail', verifyEmail);

export default router;
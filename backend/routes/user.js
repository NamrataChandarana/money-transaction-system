import express from 'express';
import { signup, signin, updateProfile, bulk } from '../controllers/user.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/user', authMiddleware, updateProfile);
router.get('/user/bulk', authMiddleware, bulk);

export default router;
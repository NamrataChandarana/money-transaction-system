import express from 'express';
import { signup, signin, updateProfile, bulk, profile,logout } from '../controllers/user.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/user', authMiddleware, updateProfile);
router.get('/user/bulk', authMiddleware, bulk);
router.get('/user/profile', authMiddleware, profile);
router.get('/user/logout', authMiddleware, logout);

export default router;
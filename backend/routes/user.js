import express from 'express';
import { signup, signin, updateProfile } from '../controllers/user';

const router = express.Router();

router.post('/singup', signup);
router.post('/singup', signin);
router.put('/user', updateProfile);
router.get('/user/bulk', updateProfile);

export default router;
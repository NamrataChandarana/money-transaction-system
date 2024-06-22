// import { Express } from "express";
import express from 'express';
import { getBalance, transfer } from "../controllers/account.js";
import { authMiddleware } from '../middleware/auth.js';


const router = express.Router();

router.get('/account',authMiddleware, getBalance);
router.post('/transfer',authMiddleware, transfer)
export default router;

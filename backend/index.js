import { config } from "dotenv";
config({
  path: "./config.env",
});
import express from "express";
import mainRouter from "./routes/index.js";
import { connectDB } from "./db.js";
import cors from 'cors'

const app = express();

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use('/api/v1', mainRouter);


const listen = app.listen(process.env.PORT, () =>{
    console.log("Running");
})
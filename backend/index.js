import express from "express";
import mainRouter from "./routes/index";
import { connectDB } from "./db";
import cors from 'cors'

const app = express();

// app.get('/', (req,res) =>{
//     res.send("home");
// })

connectDB();

app.use(cors());
app.use(express.json());
app.use('api/v1', mainRouter);


const listen = app.listen('3000', () =>{
    console.log("Running");
})
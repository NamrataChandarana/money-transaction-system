import { config } from "dotenv";
config({
  path: "./config.env",
});
import express from "express";
import mainRouter from "./routes/index.js";
import { connectDB } from "./db.js";
import cors from 'cors'

const app = express();

// app.get('/', (req,res) =>{
//     res.send("home");
// })

connectDB();

app.use(cors({
    // credentials: true,
    // path: 'localhost:5173'
    
}));
app.use(express.json());
app.use('/api/v1', mainRouter);


const listen = app.listen(process.env.PORT, () =>{
    console.log("Running");
})
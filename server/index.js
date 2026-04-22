import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';
import authroute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import interviewRoute from './routes/interviewRoute.js';
import paymentRoute from './routes/paymentRoute.js';
dotenv.config();

const app = express()

app.use(cors({
    origin: "https://interviewai-client-k2gz.onrender.com",
    credentials: true
}))

const port = process.env.PORT || 6000;

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authroute)
app.use("/api/user", userRoute)
app.use("/api/interview", interviewRoute)
app.use("/api/payment",paymentRoute)


app.listen(port, () => {
    console.log(`server running on port: http://localhost:${port} `)
    connectDB()
})

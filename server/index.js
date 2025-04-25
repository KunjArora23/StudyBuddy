import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './db/db.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/user.routes.js'
import { courseRouter } from './routes/course.routes.js';
import { paymentRouter } from './routes/payment.routes.js';
import  courseProgressRouter  from './routes/courseProgress.routes.js';
dotenv.config({});

connectDB()
const app = express();
const PORT = process.env.PORT || 3000

// Default middlerwares
app.use(express.json())

app.use(cookieParser())

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))

// It is use to accept urlencoded form data like from postman without this we need to send raw data in the form of json
app.use(express.urlencoded({ extended: true }))


// apis

app.use("/api/v1/user", userRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/course-progress", courseProgressRouter)


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})
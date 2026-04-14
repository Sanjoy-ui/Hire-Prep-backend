import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"
import mailRouter from "./routes/mail.routes.js"

const app = express()
app.use(cors({
    origin: "https://hire-prep-ai-frontend.onrender.com",
    // origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())

// Security middleware
app.use(helmet())

// Rate limiting - general
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later"
})
app.use(limiter)

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, please try again later"
})
app.use("/api/auth", authLimiter)

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)
app.use("/api/v1" , mailRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({message: "Route not found"})
})

// Global error handler (MUST be last)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({message: "Internal server error"})
})

const PORT = process.env.PORT || 6000

const startServer = async () => {
    const isDbConnected = await connectDb()

    if (!isDbConnected) {
        console.log("Server startup aborted because database connection failed")
        process.exit(1)
    }

    app.listen(PORT , ()=>{
        console.log(`Server running on port ${PORT}`)
    })
}

startServer()

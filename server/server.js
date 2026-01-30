import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"
import { clerkMiddleware, createClerkClient } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js"
import userRouter from "./routes/userRoutes.js"
import hotelRouter from "./routes/hotelRoutes.js"
import connectCloudinary from "./configs/cloudinary.js"
import roomRouter from "./routes/roomRoutes.js"
import bookingRouter from "./routes/bookingRoutes.js"

// Initialize Clerk client for server-side operations
export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
})

const app = express()

// Connect to database and cloudinary on startup
connectDB().catch(err => console.error('Failed to connect to MongoDB:', err));
connectCloudinary();

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://quick-stay-mqi67h4b7-mazidkh12s-projects.vercel.app',
        /\.vercel\.app$/ // Allow all Vercel preview deployments
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions)) //Enable Cross origin resource sharing

//API to listen clerk webhooks (MUST be before express.json() middleware)
app.post("/api/clerk", express.raw({type: "application/json"}), clerkWebhooks);

//Middleware
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send("API is working."))
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

const PORT = process.env.PORT || 3000;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel serverless
export default app;
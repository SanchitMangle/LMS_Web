import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './config/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

// Intilize Express
const app = express();

// Connect to Database
await connectDB();
await connectCloudinary()


// Middlwear
app.use(cors())
app.use(clerkMiddleware())


// Routes
app.get('/', (req, res) => {
    res.send('API WORKING')
})
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)
// Port
const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running at port : ${port}`);
})
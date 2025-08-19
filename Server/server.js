import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js';

// Intilize Express
const app = express();

// Connect to Database
 await connectDB();


// Middlwear
app.use(cors())

// Routes
app.get('/',(req,res)=>{
    res.send('API WORKING')
})
app.post('/clerk',express.json(),clerkWebhooks)

// Port
const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`Server running at port : ${port}`);
})
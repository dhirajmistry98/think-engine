import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';

import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import sql from './configs/db.js';

const app = express();

await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Test database connection
sql`SELECT 1 AS test`.then(result => {
  console.log('Database connection successful:', result);
}).catch(err => {
  console.error('Database connection test failed:', err);
});

app.get('/', (req, res) => res.send('Server is live!'));

app.use(requireAuth())

app.use('/api/ai',  aiRouter);
app.use('/api/user',  userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
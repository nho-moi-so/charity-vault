import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import fundRoutes from './routes/funds.js';
import authRoutes from './routes/auth.js';
import eventListener from './services/eventListener.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/funds', fundRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Charity Backend API is running' });
});

// Connect to MongoDB và start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Start event listener sau khi connect DB
    eventListener.startListening();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API endpoints:`);
      console.log(`  - Funds: http://localhost:${PORT}/api/funds`);
      console.log(`  - Auth: http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  eventListener.stopListening();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  eventListener.stopListening();
  process.exit(0);
});


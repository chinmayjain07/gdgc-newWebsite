import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiChatRouter from './routes/aiChat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GDGC Backend API' });
});

// AI Assistant endpoint
app.use('/api/ai', aiChatRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
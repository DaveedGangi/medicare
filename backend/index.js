import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import medRoutes from './routes/medications.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medications', medRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

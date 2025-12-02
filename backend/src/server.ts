import express from 'express';
import * as dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import { authMiddleware } from './middlewares/auth.middleware';
import vacationRoutes from './routes/vacation.routes';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/users', authMiddleware, userRoutes);

app.use('/vacations', vacationRoutes);

app.get('/', (req, res) => {
  res.send('API is running 🍾');
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});

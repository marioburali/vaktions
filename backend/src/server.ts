import express from 'express';
import * as dotenv from 'dotenv';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running 🍾');
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});

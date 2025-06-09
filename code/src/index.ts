import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { loadRoutes } from './utils/route.util';
import cors from 'cors';
import sequelize from './services/database.sevice';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load all routes
loadRoutes(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  const db = await sequelize();
  await db.authenticate();
  console.log('Database connected');
});
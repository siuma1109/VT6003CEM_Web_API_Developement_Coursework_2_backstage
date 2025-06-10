import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { loadRoutes } from './utils/route.util';
import cors from 'cors';
import sequelize from './services/database.sevice';
import passport from 'passport';
import { initializePassport } from './services/auth.service';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './configs/swagger';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());
initializePassport();

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Load all routes
loadRoutes(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
  await sequelize.authenticate();
  console.log('Database connected');
});
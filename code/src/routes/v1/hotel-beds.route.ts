import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../../services/auth.service';
import { HotelBedsController } from '../../controllers/hotel-beds.controller';

const router = Router();

// Apply authentication middleware to all routes
//router.use(authenticateToken);

// Get all users
router.get('/check-status', HotelBedsController.checkStatus as RequestHandler);
router.get('/search', HotelBedsController.getHotelsResoruces as RequestHandler);
router.post('/sync', HotelBedsController.syncHotels as RequestHandler);

export default router;

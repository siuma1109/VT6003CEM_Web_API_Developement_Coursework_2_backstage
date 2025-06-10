import { Router, RequestHandler } from 'express';
import { HotelBedsController } from '../../controllers/hotel-beds.controller';
import { isAdmin } from '../../services/permission.service';
import { authenticateToken } from '../../services/auth.service';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(isAdmin);

// Get all users
router.get('/check-status', HotelBedsController.checkStatus as RequestHandler);
router.get('/search', HotelBedsController.getHotelsResoruces as RequestHandler);
router.post('/sync', HotelBedsController.syncHotels as RequestHandler);

export default router;

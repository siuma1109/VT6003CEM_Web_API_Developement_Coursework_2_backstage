import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../../services/auth.service';
import { canManageHotels } from '../../services/permission.service';
import { HotelController } from '../../controllers/hotel.controller';

const router = Router();
const hotelController = new HotelController();

// Public routes
router.get('/', hotelController.getAllHotels as unknown as RequestHandler);
router.get('/search', hotelController.searchHotels as unknown as RequestHandler);
router.get('/:id', hotelController.getHotelById as unknown as RequestHandler);

// Protected routes
router.use(authenticateToken);
router.use(canManageHotels);

// Create new hotel
router.post('/', hotelController.createHotel as unknown as RequestHandler);

// Update hotel
router.put('/:id', hotelController.updateHotel as unknown as RequestHandler);

// Delete hotel
router.delete('/:id', hotelController.deleteHotel as unknown as RequestHandler);

export default router;

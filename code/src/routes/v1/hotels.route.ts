import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../../services/auth.service';
import { canManageHotels } from '../../services/permission.service';
import { HotelController } from '../../controllers/hotel.controller';
import { ChatRoomController } from '../../controllers/chat-room.controller';

const router = Router();
const hotelController = new HotelController();
const chatRoomController = new ChatRoomController();

// Public routes
router.get('/', hotelController.getAllHotels as unknown as RequestHandler);
router.get('/search', hotelController.searchHotels as unknown as RequestHandler);
router.get('/:id', hotelController.getHotelById as unknown as RequestHandler);

// Protected routes
router.use(authenticateToken);

// Create new hotel
router.post('/', canManageHotels, hotelController.createHotel as unknown as RequestHandler);

// Update hotel
router.put('/:id', canManageHotels, hotelController.updateHotel as unknown as RequestHandler);

// Delete hotel
router.delete('/:id', canManageHotels, hotelController.deleteHotel as unknown as RequestHandler);

// Get chat room by hotel ID and user
router.get('/:hotelId/chat-room', chatRoomController.getChatRoomByHotelAndUser as unknown as RequestHandler);

export default router;

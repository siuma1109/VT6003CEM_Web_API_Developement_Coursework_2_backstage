import { Router, RequestHandler } from 'express';
import { ChatRoomController } from '../../controllers/chat-room.controller';
import { authenticateToken } from '../../services/auth.service';

const router = Router();
const chatRoomController = new ChatRoomController();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Chat room routes
router.get('/', chatRoomController.getAllChatRooms as RequestHandler);
router.get('/:id', chatRoomController.getChatRoomById as RequestHandler);
router.post('/', chatRoomController.createChatRoom as RequestHandler);
router.put('/:id', chatRoomController.updateChatRoom as RequestHandler);
router.delete('/:id', chatRoomController.deleteChatRoom as RequestHandler);
router.post('/:id', chatRoomController.createMessage as RequestHandler);
router.get('/:id/messages', chatRoomController.getMessagesByChatRoom as RequestHandler);

export default router; 
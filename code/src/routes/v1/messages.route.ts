import { Router, RequestHandler } from 'express';
import { MessageController } from '../../controllers/message.controller';
import { authenticateToken } from '../../services/auth.service';

const router = Router();
const messageController = new MessageController();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Message routes
router.get('/chat-room/:chatRoomId', messageController.getMessagesByChatRoom as RequestHandler);
router.get('/:id', messageController.getMessageById as RequestHandler);
router.post('/', messageController.createMessage as RequestHandler);
router.put('/:id', messageController.updateMessage as RequestHandler);
router.delete('/:id/soft', messageController.softDeleteMessage as RequestHandler);
router.delete('/:id', messageController.deleteMessage as RequestHandler);

export default router; 
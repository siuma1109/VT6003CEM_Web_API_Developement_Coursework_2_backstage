import { Router, RequestHandler } from 'express';
import { UserController } from '../../controllers/user.controller';
import { authenticateToken } from '../../services/auth.service';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all users
router.get('/', UserController.getAllUsers as RequestHandler);

// Get user by ID
router.get('/:id', UserController.getUserById as RequestHandler);

// Create new user
router.post('/', UserController.createUser as RequestHandler);

// Update user
router.put('/:id', UserController.updateUser as RequestHandler);

// Delete user
router.delete('/:id', UserController.deleteUser as RequestHandler);

export default router;

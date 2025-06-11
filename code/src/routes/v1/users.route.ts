import { Router, RequestHandler } from 'express';
import { UserController } from '../../controllers/user.controller';
import { authenticateToken } from '../../services/auth.service';
import { canAddUser, canUpdateOrDeleteUser } from '../../services/permission.service';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/avatars/' });

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all users
router.get('/', UserController.getAllUsers as RequestHandler);

// Get user by ID
router.get('/:id', canUpdateOrDeleteUser, UserController.getUserById as RequestHandler);

// Create new user
router.post('/', canAddUser, UserController.createUser as RequestHandler);

// Update user
router.put('/:id', canUpdateOrDeleteUser, UserController.updateUser as RequestHandler);

// Delete user
router.delete('/:id', canUpdateOrDeleteUser, UserController.deleteUser as RequestHandler);

// Upload avatar
router.post('/:id/avatar', canUpdateOrDeleteUser, upload.single('avatar'), UserController.uploadAvatar as RequestHandler);

// Favorites routes
router.post('/:id/favourites', canUpdateOrDeleteUser, UserController.addToFavourites as RequestHandler);
router.delete('/:id/favourites', canUpdateOrDeleteUser, UserController.removeFromFavourites as RequestHandler);
router.get('/:id/favourites', canUpdateOrDeleteUser, UserController.getFavourites as RequestHandler);
router.get('/:id/favourites/check', canUpdateOrDeleteUser, UserController.checkFavourite as RequestHandler);

export default router;

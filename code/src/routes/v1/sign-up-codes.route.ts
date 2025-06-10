import { Router, RequestHandler } from 'express';
import { SignUpCodesController } from '../../controllers/sign-up-codes.controller';
import { authenticateToken } from '../../services/auth.service';
import { isAdmin } from '../../services/permission.service';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Admin routes
router.get('/', isAdmin, SignUpCodesController.getAllCodes as RequestHandler);
router.post('/generate', isAdmin, SignUpCodesController.generateCode as RequestHandler);

// Public route for code validation
router.post('/validate', SignUpCodesController.validateCode as RequestHandler);

export default router; 
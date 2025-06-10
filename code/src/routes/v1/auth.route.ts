import { Router } from 'express';
import { register, login, logout, createSignUpCode, checkEmailExists } from '../../controllers/auth.controller';
import { authenticateToken } from '../../services/auth.service';
import { isAdmin } from '../../services/permission.service';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.post('/sign-up-code', authenticateToken, isAdmin, createSignUpCode);
router.post('/check-email-exists', checkEmailExists);

export default router;
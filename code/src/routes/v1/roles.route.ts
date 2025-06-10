import { Router } from 'express';
import { isAdmin } from '../../services/permission.service';
import {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} from '../../controllers/role.controller';
import { authenticateToken } from '../../services/auth.service';

const router = Router();

// All routes are protected with isAdmin middleware
router.use(authenticateToken);
router.use(isAdmin);

// Role CRUD routes
router.get('/', getAllRoles as any);
router.get('/:id', getRoleById as any);
router.post('/', createRole as any);
router.put('/:id', updateRole as any);
router.delete('/:id', deleteRole as any);

export default router; 
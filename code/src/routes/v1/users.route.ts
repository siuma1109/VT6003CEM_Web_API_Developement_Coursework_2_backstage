import { Router, Request, Response, RequestHandler } from 'express';
import { User } from '../../models/user.model';
import { InferAttributes, InferCreationAttributes } from '@sequelize/core';
import { UserService } from '../../services/user.service';
import { apiResponse } from '../../utils/api-response.util';
import { handleException } from '../../utils/model.util';

const router = Router();

// Get all users
router.get('/', (async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const result = await UserService.getAll(page, limit);
    apiResponse(res, 200, 'Users fetched successfully', result.paginate, result.data);
}) as RequestHandler);

// Get user by ID
router.get('/:id', (async (req: Request, res: Response) => {
    const user = await UserService.getById(parseInt(req.params.id));
    if (!user) {
        return apiResponse(res, 404, 'User not found');
    }
    apiResponse(res, 200, 'User fetched successfully', undefined, user);
}) as RequestHandler);

// Create new user
router.post('/', (async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        const newUser = await UserService.create({ name, email, password } as InferCreationAttributes<User>);
        apiResponse(res, 201, 'User created successfully', undefined, newUser);
    } catch (error: any) {
        const errorResponse = handleException(error);
        apiResponse(res, 400, errorResponse.message, undefined, undefined, errorResponse.errors);
    }
}) as RequestHandler);

// Update user
router.put('/:id', (async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    try {
        const updatedUser = await UserService.update(id, { name } as InferAttributes<User>);
        if (!updatedUser) {
            return apiResponse(res, 404, 'User not found');
        }
        apiResponse(res, 200, 'User update successfully', undefined, updatedUser);
    } catch (error: any) {
        const errorResponse = handleException(error);
        apiResponse(res, 400, errorResponse.message, undefined, undefined, errorResponse.errors);
    }
}) as RequestHandler);

// Delete user
router.delete('/:id', (async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const success = await UserService.delete(id);
        if (!success) {
            return apiResponse(res, 404, 'User not found');
        }
        apiResponse(res, 204, 'User deleted');
    } catch (error: any) {
        const errorResponse = handleException(error);
        apiResponse(res, 400, errorResponse.message, undefined, undefined, errorResponse.errors);
    }

}) as RequestHandler);

export default router;

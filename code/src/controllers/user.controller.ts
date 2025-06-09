import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { InferAttributes, InferCreationAttributes } from '@sequelize/core';
import { UserService } from '../services/user.service';
import { apiResponse } from '../utils/api-response.util';
import { handleException } from '../utils/model.util';

export class UserController {
    static async getAllUsers(req: Request, res: Response) {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const result = await UserService.getAll(page, limit);
        apiResponse(res, 200, 'Users fetched successfully', result.paginate, result.data);
    }

    static async getUserById(req: Request, res: Response) {
        const user = await UserService.getById(parseInt(req.params.id));
        if (!user) {
            return apiResponse(res, 404, 'User not found');
        }
        apiResponse(res, 200, 'User fetched successfully', undefined, user);
    }

    static async getUserByEmail(req: Request, res: Response) {
        const user = await UserService.getByEmail(req.params.email);
        if (!user) {
            return apiResponse(res, 404, 'User not found');
        }
        apiResponse(res, 200, 'User fetched successfully', undefined, user);
    }

    static async createUser(req: Request, res: Response) {
        const { name, email, password } = req.body;
        try {
            const newUser = await UserService.create({ name, email, password } as InferCreationAttributes<User>);
            apiResponse(res, 201, 'User created successfully', undefined, newUser);
        } catch (error: any) {
            const errorResponse = handleException(error);
            apiResponse(res, 400, errorResponse.message, undefined, undefined, errorResponse.errors);
        }
    }

    static async updateUser(req: Request, res: Response) {
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
    }

    static async deleteUser(req: Request, res: Response) {
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
    }
} 
import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { InferAttributes, InferCreationAttributes } from '@sequelize/core';
import { UserService } from '../services/user.service';
import { apiResponse } from '../utils/api-response.util';
import { handleException } from '../utils/model.util';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { UsersHotelsFavourites } from '../models/users-hotels-favourites.model';
import { Hotel } from '../models/hotel.model';

interface FileRequest extends Request {
    file?: Express.Multer.File;
}

export class UserController {
    static async getAllUsers(req: Request, res: Response) {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const result = await UserService.getAll(page, limit);
        apiResponse(res, 200, 'Users fetched successfully', result.paginate, result.data);
    }

    static async getUserById(req: Request, res: Response) {
        let id = req.params.id;
        if(id == 'me') {
            const user = req.user as User;
            if (!user) {
                return apiResponse(res, 401, 'User not authenticated');
            }
            id = user.id.toString();
        }
        const retrieveUser = await UserService.getById(parseInt(id));
        if (!retrieveUser) {
            return apiResponse(res, 404, 'User not found');
        }
        apiResponse(res, 200, 'User fetched successfully', undefined, retrieveUser);
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
        let id = req.params.id;
        if(id == 'me') {
            const user = req.user as User;
            if (!user) {
                return apiResponse(res, 401, 'User not authenticated');
            }
            id = user.id.toString();
        }
        const { name } = req.body;
        try {
            const updatedUser = await UserService.update(parseInt(id), { name } as InferAttributes<User>);
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

    static async getProfile(req: Request, res: Response) {
        const user = req.user as User;
        if (!user) {
            return apiResponse(res, 401, 'User not authenticated');
        }
        const returnUser = await UserService.getById(user.id);
        if (!user) {
            return apiResponse(res, 404, 'User not found');
        }
        apiResponse(res, 200, 'Profile fetched successfully', undefined, user);
    }

    static async updateProfile(req: Request, res: Response) {
        const user = req.user as User;
        if (!user) {
            return apiResponse(res, 401, 'User not authenticated');
        }
        const { name } = req.body;
        try {
            const updatedUser = await UserService.update(user.id, { name } as InferAttributes<User>);
            if (!updatedUser) {
                return apiResponse(res, 404, 'User not found');
            }
            apiResponse(res, 200, 'Profile updated successfully', undefined, updatedUser);
        } catch (error: any) {
            const errorResponse = handleException(error);
            apiResponse(res, 400, errorResponse.message, undefined, undefined, errorResponse.errors);
        }
    }

    static async uploadAvatar(req: FileRequest, res: Response) {
        try {
            if (!req.file) {
                return apiResponse(res, 400, 'No file uploaded');
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return apiResponse(res, 400, 'Invalid file type. Only images are allowed.');
            }

            // Validate file size (5MB)
            const maxSize = 5 * 1024 * 1024;
            if (req.file.size > maxSize) {
                return apiResponse(res, 400, 'File too large. Maximum size is 5MB.');
            }

            let id = req.params.id;
            if(id == 'me') {
                const user = req.user as User;
                if (!user) {
                    return apiResponse(res, 401, 'User not authenticated');
                }
                id = user.id.toString();
            }

            // Delete old avatar if exists
            const user = await UserService.getById(parseInt(id));
            if (!user) {
                return apiResponse(res, 404, 'User not found');
            }

            if (user.avatar) {
                const oldAvatarPath = path.join(process.cwd(), user.avatar);
                if (fs.existsSync(oldAvatarPath)) {
                    fs.unlinkSync(oldAvatarPath);
                }
            }

            // Generate new filename with original extension
            const ext = path.extname(req.file.originalname);
            const newFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
            const newPath = path.join('uploads/avatars', newFilename);

            // Move file to new location with proper extension
            fs.renameSync(req.file.path, path.join(process.cwd(), newPath));

            // Update user with new avatar path
            const updatedUser = await UserService.update(parseInt(id), { avatar: newPath });
            
            if (!updatedUser) {
                return apiResponse(res, 404, 'User not found');
            }
            
            apiResponse(res, 200, 'Avatar uploaded successfully', undefined, updatedUser);
        } catch (error: any) {
            const errorResponse = handleException(error);
            apiResponse(res, 400, errorResponse.message, undefined, undefined, errorResponse.errors);
        }
    }

    static async addToFavourites(req: Request, res: Response) {
        try {
            const user = req.user as User;
            const userId = user?.id;
            const { hotelId } = req.body;

            if (!userId) {
                return apiResponse(res, 401, 'User not authenticated');
            }

            if (!hotelId) {
                return apiResponse(res, 400, 'Hotel ID is required');
            }

            // Check if hotel exists
            const hotel = await Hotel.findByPk(hotelId);
            if (!hotel) {
                return apiResponse(res, 404, 'Hotel not found');
            }

            // Check if already in favorites
            const existingFavourite = await UsersHotelsFavourites.findOne({
                where: { userId, hotelId }
            });

            if (existingFavourite) {
                return apiResponse(res, 400, 'Hotel already in favorites');
            }

            const favourite = await UsersHotelsFavourites.create({
                userId,
                hotelId
            });

            apiResponse(res, 201, 'Hotel added to favorites successfully', undefined, favourite);
        } catch (error: any) {
            const errorResponse = handleException(error);
            apiResponse(res, 500, 'Failed to add hotel to favorites', undefined, undefined, errorResponse.errors);
        }
    }

    static async removeFromFavourites(req: Request, res: Response) {
        try {
            const user = req.user as User;
            const userId = user?.id;
            const { hotelId } = req.body;

            if (!userId) {
                return apiResponse(res, 401, 'User not authenticated');
            }

            if (!hotelId) {
                return apiResponse(res, 400, 'Hotel ID is required');
            }

            const deleted = await UsersHotelsFavourites.destroy({
                where: { userId, hotelId }
            });

            if (!deleted) {
                return apiResponse(res, 404, 'Favorite not found');
            }

            apiResponse(res, 200, 'Hotel removed from favorites successfully');
        } catch (error: any) {
            const errorResponse = handleException(error);
            apiResponse(res, 500, 'Failed to remove hotel from favorites', undefined, undefined, errorResponse.errors);
        }
    }

    static async getFavourites(req: Request, res: Response) {
        try {
            const user = req.user as User;
            const userId = user?.id;

            if (!userId) {
                return apiResponse(res, 401, 'User not authenticated');
            }
            const favourites = await UsersHotelsFavourites.findAll({
                where: { userId },
                include: [{
                    model: Hotel,
                    attributes: ['id', 'name', 'description', 'address']
                }]
            });
            apiResponse(res, 200, 'Favorites retrieved successfully', undefined, favourites);
        } catch (error: any) {
            const errorResponse = handleException(error);
            apiResponse(res, 500, 'Failed to fetch favorites', undefined, undefined, errorResponse.errors);
        }
    }

    static async checkFavourite(req: Request, res: Response) {
        try {
            const user = req.user as User;
            const userId = user?.id;
            const { hotelId } = req.body;

            if (!userId) {
                return apiResponse(res, 401, 'User not authenticated');
            }

            if (!hotelId) {
                return apiResponse(res, 400, 'Hotel ID is required');
            }

            const favourite = await UsersHotelsFavourites.findOne({
                where: { userId, hotelId }
            });

            apiResponse(res, 200, 'Favorite status checked successfully', undefined, { isFavourite: !!favourite });
        } catch (error: any) {
            const errorResponse = handleException(error);
            apiResponse(res, 500, 'Failed to check favorite status', undefined, undefined, errorResponse.errors);
        }
    }
} 
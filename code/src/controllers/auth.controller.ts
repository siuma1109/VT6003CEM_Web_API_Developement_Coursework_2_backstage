import { Request, Response, RequestHandler } from 'express';
import { generateTokens, refreshAccessToken, revokeTokens, createSignUpCode as generateSignUpCode } from '../services/auth.service';
import { apiResponse } from '../utils/api-response.util';
import { UserService } from '../services/user.service';
import { handleException } from '../utils/model.util';
import { PasswordService } from '../services/password.service';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import { SignUpCodes } from '../models/sign-up-codes.model';
import { UsersRoles } from '../models/users-roles.model';
import { Op } from 'sequelize';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, signUpCode } = req.body;

        // Check if user already exists
        const existingUser = await UserRepository.getByEmail(email);
        if (existingUser) {
            apiResponse(res, 400, 'User already exists');
            return;
        }

        // Validate sign-up code if provided
        if (signUpCode) {
            const codeRecord = await SignUpCodes.findOne({
                where: {
                    code: signUpCode
                }
            });

            if (!codeRecord || codeRecord.expiresAt < new Date()) {
                apiResponse(res, 400, 'Invalid or expired sign-up code');
                return;
            }

            // Create new user
            const user = await UserService.create({
                name,
                email,
                password
            });

            // Assign operator role
            await UsersRoles.create({
                userId: user.id,
                roleId: codeRecord.roleId
            });

            // Delete the used code
            await SignUpCodes.destroy({
                where: { id: codeRecord.id }
            });

            // Generate tokens
            const { accessToken, refreshToken } = await generateTokens(user.id);
            const metaData = new Map();
            metaData.set('accessToken', accessToken);
            metaData.set('refreshToken', refreshToken);

            apiResponse(res, 201, 'User registered successfully', undefined, user, undefined, metaData);
        } else {
            // Regular user registration without code
            const user = await UserService.create({
                name,
                email,
                password
            });

            // Generate tokens
            const { accessToken, refreshToken } = await generateTokens(user.id);
            const metaData = new Map();
            metaData.set('accessToken', accessToken);
            metaData.set('refreshToken', refreshToken);

            apiResponse(res, 201, 'User registered successfully', undefined, user, undefined, metaData);
        }
    } catch (error) {
        const errorResponse = handleException(error);
        apiResponse(res, 400, errorResponse.message, undefined, undefined, errorResponse.errors);
    }
};

export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await UserService.getByEmailWithPassword(email);
        if (!user) {
            apiResponse(res, 401, 'Invalid credentials');
            return;
        }

        const comparePassword = await PasswordService.compare(password, user.password);

        if (!comparePassword) {
            apiResponse(res, 401, 'Invalid credentials');
            return;
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateTokens(user.id);
        const metaData = new Map();
        metaData.set('accessToken', accessToken);
        metaData.set('refreshToken', refreshToken);

        // Get user without password using default scope
        const userWithoutPassword = await UserService.getById(user.id);
        if (!userWithoutPassword) {
            apiResponse(res, 500, 'Error retrieving user data');
            return;
        }
        apiResponse(res, 200, 'Login successful', undefined, userWithoutPassword, undefined, metaData);
    } catch (error) {
        const errorResponse = handleException(error);
        apiResponse(res, 500, 'Error logging in', undefined, undefined, errorResponse.errors);
    }
};

export const refresh: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            apiResponse(res, 400, 'Refresh token is required');
            return;
        }

        const tokens = await refreshAccessToken(refreshToken);
        if (!tokens) {
            apiResponse(res, 401, 'Invalid or expired refresh token');
            return;
        }

        const metaData = new Map();
        metaData.set('accessToken', tokens.accessToken);
        metaData.set('refreshToken', tokens.refreshToken);

        apiResponse(res, 200, 'Tokens refreshed successfully', undefined, undefined, undefined, metaData);
    } catch (error) {
        const errorResponse = handleException(error);
        apiResponse(res, 500, 'Error refreshing tokens', undefined, undefined, errorResponse.errors);
    }
};

export const logout: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as User & { id: number };
        if (!user?.id) {
            apiResponse(res, 401, 'User not authenticated');
            return;
        }

        await revokeTokens(user.id);
        apiResponse(res, 200, 'Logged out successfully');
    } catch (error) {
        const errorResponse = handleException(error);
        apiResponse(res, 500, 'Error logging out', undefined, undefined, errorResponse.errors);
    }
};

export const createSignUpCode: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as User;
        const newCode = await generateSignUpCode(user);
        if (!newCode) {
            apiResponse(res, 500, 'Failed to create sign-up code');
            return;
        }
        apiResponse(res, 201, 'Sign-up code created successfully', undefined, newCode);
    } catch (error: any) {
        console.log(error);
        const errorResponse = handleException(error);
        apiResponse(res, 500, 'Error creating sign-up code', undefined, undefined, errorResponse.errors);
    }
};

export const checkEmailExists: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        
        if (!email) {
            apiResponse(res, 400, 'Email is required');
            return;
        }

        const user = await UserService.getByEmail(email);
        apiResponse(res, 200, 'Email check completed', undefined, { exists: !!user });
    } catch (error) {
        const errorResponse = handleException(error);
        apiResponse(res, 500, 'Error checking email', undefined, undefined, errorResponse.errors);
    }
};
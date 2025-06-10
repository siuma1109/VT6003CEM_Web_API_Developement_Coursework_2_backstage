import { Request, Response } from 'express';
import { SignUpCodesService } from '../services/sign-up-codes.service';
import { User } from '../models/user.model';
import { apiResponse } from '../utils/api-response.util';

export class SignUpCodesController {
    private static service = new SignUpCodesService();

    static async getAllCodes(req: Request, res: Response): Promise<void> {
        try {
            const codes = await SignUpCodesController.service.getAllCodes();
            apiResponse(res, 200, 'Sign-up codes retrieved successfully', undefined, codes);
        } catch (error: any) {
            apiResponse(res, 500, 'Error retrieving sign-up codes', undefined, undefined, error.message);
        }
    }

    static async generateCode(req: Request, res: Response): Promise<void> {
        try {
            const { roleId } = req.body;
            const user = req.user as User;

            if (!roleId || !user) {
                apiResponse(res, 400, 'Role ID and user ID are required');
                return;
            }

            const code = await SignUpCodesController.service.generateCode(roleId, user.id);
            if (!code) {
                apiResponse(res, 500, 'Failed to generate sign-up code');
                return;
            }
            apiResponse(res, 201, 'Sign-up code generated successfully', undefined, code);
        } catch (error: any) {
            apiResponse(res, 500, 'Error generating sign-up code', undefined, undefined, error.message);
        }
    }

    static async validateCode(req: Request, res: Response): Promise<void> {
        try {
            const { code } = req.body;
            
            if (!code) {
                apiResponse(res, 400, 'Code is required');
                return;
            }

            const validCode = await SignUpCodesController.service.validateCode(code);
            
            if (!validCode) {
                apiResponse(res, 400, 'Invalid or expired code');
                return;
            }

            apiResponse(res, 200, 'Code is valid', undefined, validCode);
        } catch (error: any) {
            apiResponse(res, 500, 'Error validating sign-up code', undefined, undefined, error.message);
        }
    }
} 
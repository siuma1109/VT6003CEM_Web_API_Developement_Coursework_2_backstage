import { Request, Response } from 'express';
import { MessageService } from '../services/message.service';
import { apiResponse } from '../utils/api-response.util';
import { User } from '../models/user.model';

export class MessageController {
    private service: MessageService;

    constructor() {
        this.service = new MessageService();
    }

    getMessagesByChatRoom = async (req: Request, res: Response): Promise<void> => {
        try {
            const chatRoomId = parseInt(req.params.chatRoomId);
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const result = await this.service.getMessagesByChatRoom(chatRoomId, page, limit, user);
            apiResponse(res, 200, 'Messages retrieved successfully', result.paginate, result.data);
        } catch (error: any) {
            apiResponse(res, 500, 'Error retrieving messages', undefined, undefined, error.message);
        }
    };

    getMessageById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const message = await this.service.getMessageById(id, user);
            if (!message) {
                apiResponse(res, 404, 'Message not found');
                return;
            }

            apiResponse(res, 200, 'Message retrieved successfully', undefined, message);
        } catch (error: any) {
            apiResponse(res, 500, 'Error retrieving message', undefined, undefined, error.message);
        }
    };

    createMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const message = await this.service.createMessage(req.body, user);
            apiResponse(res, 201, 'Message created successfully', undefined, message);
        } catch (error: any) {
            apiResponse(res, 400, 'Error creating message', undefined, undefined, error.message);
        }
    };

    updateMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const updatedMessage = await this.service.updateMessage(id, req.body, user);
            if (!updatedMessage) {
                apiResponse(res, 404, 'Message not found');
                return;
            }
            apiResponse(res, 200, 'Message updated successfully', undefined, updatedMessage);
        } catch (error: any) {
            apiResponse(res, 400, 'Error updating message', undefined, undefined, error.message);
        }
    };

    softDeleteMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const success = await this.service.softDeleteMessage(id, user);
            if (!success) {
                apiResponse(res, 404, 'Message not found');
                return;
            }
            apiResponse(res, 200, 'Message deleted successfully');
        } catch (error: any) {
            apiResponse(res, 400, 'Error deleting message', undefined, undefined, error.message);
        }
    };

    deleteMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const success = await this.service.deleteMessage(id, user);
            if (!success) {
                apiResponse(res, 404, 'Message not found');
                return;
            }
            apiResponse(res, 200, 'Message permanently deleted successfully');
        } catch (error: any) {
            apiResponse(res, 400, 'Error deleting message', undefined, undefined, error.message);
        }
    };
} 
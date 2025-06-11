import { Request, Response } from 'express';
import { ChatRoomService } from '../services/chat-room.service';
import { MessageService } from '../services/message.service';
import { apiResponse } from '../utils/api-response.util';
import { User } from '../models/user.model';
import { ChatRoom } from '../models/chat-room.model';
import { UsersRoles } from '../models/users-roles.model';
import { Role } from '../models/role.model';
import { Op } from 'sequelize';
import { InferCreationAttributes } from '@sequelize/core';
import { Message } from '../models/message.model';

export class ChatRoomController {
    private chatRoomService: ChatRoomService;
    private messageService: MessageService;

    constructor() {
        this.chatRoomService = new ChatRoomService();
        this.messageService = new MessageService();
    }

    private async hasAdminOrOperatorRole(userId: number): Promise<boolean> {
        const userRole = await UsersRoles.findOne({
            where: { userId },
            include: [{
                model: Role,
                where: {
                    name: {
                        [Op.in]: ['admin', 'travel_agency_operator']
                    }
                }
            }]
        });
        return !!userRole;
    }

    getAllChatRooms = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string || '';
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const result = await this.chatRoomService.getAllChatRooms(page, limit, search, user);
            apiResponse(res, 200, 'Chat rooms retrieved successfully', result.paginate, result.data);
        } catch (error: any) {
            apiResponse(res, 500, 'Error retrieving chat rooms', undefined, undefined, error.message);
        }
    };

    getChatRoomById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const chatRoom = await this.chatRoomService.getChatRoomById(id, user);
            if (!chatRoom) {
                apiResponse(res, 404, 'Chat room not found');
                return;
            }

            apiResponse(res, 200, 'Chat room retrieved successfully', undefined, chatRoom);
        } catch (error: any) {
            apiResponse(res, 500, 'Error retrieving chat room', undefined, undefined, error.message);
        }
    };

    createChatRoom = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const chatRoom = await this.chatRoomService.createChatRoom({
                ...req.body,
                userId: user.id
            });
            apiResponse(res, 201, 'Chat room created successfully', undefined, chatRoom);
        } catch (error: any) {
            apiResponse(res, 400, 'Error creating chat room', undefined, undefined, error.message);
        }
    };

    updateChatRoom = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const chatRoom = await this.chatRoomService.getChatRoomById(id, user);
            if (!chatRoom) {
                apiResponse(res, 404, 'Chat room not found');
                return;
            }

            const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
            if (!isAdminOrOperator && chatRoom.userId !== user.id) {
                apiResponse(res, 403, 'You do not have permission to update this chat room');
                return;
            }

            const updatedChatRoom = await this.chatRoomService.updateChatRoom(id, req.body, user);
            if (!updatedChatRoom) {
                apiResponse(res, 404, 'Chat room not found');
                return;
            }
            apiResponse(res, 200, 'Chat room updated successfully', undefined, updatedChatRoom);
        } catch (error: any) {
            apiResponse(res, 400, 'Error updating chat room', undefined, undefined, error.message);
        }
    };

    deleteChatRoom = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const chatRoom = await this.chatRoomService.getChatRoomById(id, user);
            if (!chatRoom) {
                apiResponse(res, 404, 'Chat room not found');
                return;
            }

            const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
            if (!isAdminOrOperator && chatRoom.userId !== user.id) {
                apiResponse(res, 403, 'You do not have permission to delete this chat room');
                return;
            }

            const success = await this.chatRoomService.deleteChatRoom(id, user);
            apiResponse(res, 200, 'Chat room deleted successfully');
        } catch (error: any) {
            apiResponse(res, 400, 'Error deleting chat room', undefined, undefined, error.message);
        }
    };

    createMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const chatRoomId = parseInt(req.params.id);
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            // Check if chat room exists and user has access
            const chatRoom = await this.chatRoomService.getChatRoomById(chatRoomId, user);
            if (!chatRoom) {
                apiResponse(res, 404, 'Chat room not found');
                return;
            }

            // Create message with the authenticated user as sender
            const createdMessage = await this.messageService.createMessage({
                chatRoomId,
                content: req.body.content
            } as Partial<InferCreationAttributes<Message>>,
                user);

            // Force update chat room timestamp
            chatRoom.newMessageTime = new Date();
            await chatRoom.save();

            const retrievedMessage = await this.messageService.getMessageById(createdMessage.id, user);

            apiResponse(res, 201, 'Message created successfully', undefined, retrievedMessage);
        } catch (error: any) {
            apiResponse(res, 400, 'Error creating message', undefined, undefined, error.message);
        }
    };

    getMessagesByChatRoom = async (req: Request, res: Response): Promise<void> => {
        try {
            const chatRoomId = parseInt(req.params.id);
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            // Check if chat room exists and user has access
            const chatRoom = await this.chatRoomService.getChatRoomById(chatRoomId, user);
            if (!chatRoom) {
                apiResponse(res, 404, 'Chat room not found');
                return;
            }

            const result = await this.messageService.getMessagesByChatRoom(chatRoomId, page, limit, user);
            apiResponse(res, 200, 'Messages retrieved successfully', result.paginate, result.data);
        } catch (error: any) {
            apiResponse(res, 500, 'Error retrieving messages', undefined, undefined, error.message);
        }
    };

    getChatRoomsByHotelId = async (req: Request, res: Response): Promise<void> => {
        try {
            const hotelId = parseInt(req.params.hotelId);
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const result = await this.chatRoomService.getChatRoomsByHotelId(hotelId, page, limit, user);
            apiResponse(res, 200, 'Chat rooms retrieved successfully', result.paginate, result.data);
        } catch (error: any) {
            apiResponse(res, 500, 'Error retrieving chat rooms', undefined, undefined, error.message);
        }
    };

    getChatRoomByHotelAndUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const hotelId = parseInt(req.params.hotelId);
            const user = req.user as User;
            if (!user) {
                apiResponse(res, 401, 'User not authenticated');
                return;
            }

            const chatRoom = await this.chatRoomService.getChatRoomByHotelAndUser(hotelId, user);
            if (!chatRoom) {
                apiResponse(res, 404, 'Chat room not found');
                return;
            }
            apiResponse(res, 200, 'Chat room retrieved successfully', undefined, chatRoom);
        } catch (error: any) {
            apiResponse(res, 500, 'Error retrieving or creating chat room', undefined, undefined, error.message);
        }
    };
} 
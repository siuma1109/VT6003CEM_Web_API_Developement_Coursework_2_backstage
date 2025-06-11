import { MessageRepository } from '../repositories/message.repository';
import { Message } from '../models/message.model';
import { InferCreationAttributes } from '@sequelize/core';
import { PaginatedResult } from '../utils/model.util';
import { ChatRoom } from '../models/chat-room.model';
import { User } from '../models/user.model';
import { UsersRoles } from '../models/users-roles.model';
import { Role } from '../models/role.model';
import { Op } from 'sequelize';

export class MessageService {
    private repository: MessageRepository;

    constructor() {
        this.repository = new MessageRepository();
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

    async getMessagesByChatRoom(chatRoomId: number, page: number = 1, limit: number = 10, user?: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }

        const chatRoom = await ChatRoom.findByPk(chatRoomId);
        if (!chatRoom) {
            throw new Error('Chat room not found');
        }

        const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
        if (!isAdminOrOperator && chatRoom.userId !== user.id) {
            throw new Error('You do not have permission to access messages in this chat room');
        }

        return this.repository.paginate(chatRoomId, page, limit);
    }

    async getMessageById(id: number, user?: User) {

        if (!user) {
            throw new Error('User not authenticated');
        }

        const message = await this.repository.findById(id);
        if (!message) {
            throw new Error('Message not found');
        }

        const chatRoom = await ChatRoom.findByPk(message.chatRoomId);
        if (!chatRoom) {
            throw new Error('Chat room not found');
        }

        const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
        if (!isAdminOrOperator && chatRoom.userId !== user.id && message.senderId !== user.id) {
            throw new Error('You do not have permission to access this message');
        }

        return message;
    }

    async createMessage(data: Partial<InferCreationAttributes<Message>>, user?: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Validate required fields
        if (!data.chatRoomId || !data.content) {
            throw new Error('Chat room ID and content are required');
        }

        // Check if chat room exists
        const chatRoom = await ChatRoom.findByPk(data.chatRoomId);
        if (!chatRoom) {
            throw new Error('Chat room not found');
        }

        const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
        if (!isAdminOrOperator && chatRoom.userId !== user.id) {
            throw new Error('You do not have permission to send messages in this chat room');
        }

        return this.repository.create({
            ...data,
            senderId: user.id
        } as Message);
    }

    async updateMessage(id: number, data: Partial<InferCreationAttributes<Message>>, user?: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }

        const message = await this.repository.findById(id);
        if (!message) {
            throw new Error('Message not found');
        }

        const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
        if (!isAdminOrOperator && message.senderId !== user.id) {
            throw new Error('You can only update your own messages');
        }

        return this.repository.update(id, data);
    }

    async softDeleteMessage(id: number, user?: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }

        const message = await this.repository.findById(id);
        if (!message) {
            throw new Error('Message not found');
        }

        const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
        if (!isAdminOrOperator && message.senderId !== user.id) {
            throw new Error('You can only delete your own messages');
        }

        return this.repository.softDelete(id);
    }

    async deleteMessage(id: number, user?: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }

        const message = await this.repository.findById(id);
        if (!message) {
            throw new Error('Message not found');
        }

        const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
        if (!isAdminOrOperator && message.senderId !== user.id) {
            throw new Error('You can only delete your own messages');
        }

        return this.repository.delete(id);
    }

    async getMessagesByChatRoomId(chatRoomId: number) {
        return await this.repository.findByChatRoom(chatRoomId);
    }
} 
import { ChatRoomRepository } from '../repositories/chat-room.repository';
import { ChatRoom } from '../models/chat-room.model';
import { InferCreationAttributes } from '@sequelize/core';
import { PaginatedResult } from '../utils/model.util';
import { User } from '../models/user.model';
import { Hotel } from '../models/hotel.model';
import { UsersRoles } from '../models/users-roles.model';
import { Role } from '../models/role.model';
import { Op } from 'sequelize';

export class ChatRoomService {
    private repository: ChatRoomRepository;

    constructor() {
        this.repository = new ChatRoomRepository();
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

    async getAllChatRooms(page: number = 1, limit: number = 10, search: string = '', user?: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }

        const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
        return this.repository.paginate(page, limit, search, user.id, isAdminOrOperator);
    }

    async getChatRoomById(id: number, user?: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }

        const chatRoom = await this.repository.findById(id);
        if (!chatRoom) {
            throw new Error('Chat room not found');
        }

        const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
        if (!isAdminOrOperator && chatRoom.userId !== user.id) {
            throw new Error('You do not have permission to access this chat room');
        }

        return chatRoom;
    }

    async createChatRoom(data: InferCreationAttributes<ChatRoom>) {
        // Validate required fields
        if (!data.userId || !data.hotelId) {
            throw new Error('User ID and Hotel ID are required');
        }

        // Check if hotel exists
        const hotel = await Hotel.findByPk(data.hotelId);
        if (!hotel) {
            throw new Error('Hotel not found');
        }

        // Check if chat room already exists for this user and hotel
        const existingChatRoom = await this.repository.findByUserAndHotel(data.userId, data.hotelId);
        if (existingChatRoom) {
            throw new Error('Chat room already exists for this user and hotel');
        }

        return this.repository.create(data);
    }

    async updateChatRoom(id: number, data: Partial<InferCreationAttributes<ChatRoom>>, user?: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }

        const chatRoom = await this.repository.findById(id);
        if (!chatRoom) {
            throw new Error('Chat room not found');
        }

        const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
        if (!isAdminOrOperator && chatRoom.userId !== user.id) {
            throw new Error('You do not have permission to update this chat room');
        }

        return this.repository.update(id, data);
    }

    async deleteChatRoom(id: number, user?: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }

        const chatRoom = await this.repository.findById(id);
        if (!chatRoom) {
            throw new Error('Chat room not found');
        }

        const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
        if (!isAdminOrOperator && chatRoom.userId !== user.id) {
            throw new Error('You do not have permission to delete this chat room');
        }

        return this.repository.delete(id);
    }

    async getChatRoomsByHotelId(hotelId: number, page: number = 1, limit: number = 10, user?: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }

        const isAdminOrOperator = await this.hasAdminOrOperatorRole(user.id);
        if (!isAdminOrOperator) {
            throw new Error('You do not have permission to view hotel chat rooms');
        }

        return this.repository.findByHotelId(hotelId, page, limit);
    }

    async getChatRoomByHotelAndUser(hotelId: number, user?: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Try to find existing chat room
        let chatRoom = await this.repository.findByUserAndHotel(user.id, hotelId);
        
        // If not found, create a new one
        if (!chatRoom) {
            const chatRoomData: Partial<InferCreationAttributes<ChatRoom>> = {
                userId: user.id,
                hotelId: hotelId,
                newMessageTime: new Date()
            };
            chatRoom = await this.createChatRoom(chatRoomData as InferCreationAttributes<ChatRoom>);
            chatRoom = await this.repository.findByUserAndHotel(user.id, hotelId);
        }

        return chatRoom;
    }
} 
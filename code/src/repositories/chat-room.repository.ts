import { ChatRoom } from '../models/chat-room.model';
import { Hotel } from '../models/hotel.model';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';
import { Op, Order, literal } from 'sequelize';
import { InferCreationAttributes } from '@sequelize/core';
import { PaginatedResult } from '../utils/model.util';
import { paginate } from '../utils/model.util';

export class ChatRoomRepository {
    async findAll(options: any = {}) {
        return await ChatRoom.findAll({
            ...options,
            include: [
                {
                    model: Hotel,
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
    }

    async paginate(page: number, limit: number, search: string, userId?: number, isOperator: boolean = false): Promise<PaginatedResult<ChatRoom>> {
        const where: any = {};

        // If not operator, only show user's chat rooms
        if (!isOperator && userId) {
            where.userId = userId;
        }

        // Add hotel name search if provided
        if (search) {
            where['$hotel.name$'] = { [Op.iLike]: `%${search.toLowerCase()}%` };
        }

        const options = {
            where,
            include: [
                {
                    model: Hotel,
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Message,
                    attributes: ['id', 'content', 'senderId', 'createdAt'],
                    required: false,
                    separate: true,
                    where: { isDeleted: false },
                    order: [['id', 'DESC']] as Order,
                    limit: 1,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email']
                        }
                    ]
                }
            ],
            order: [
                ['newMessageTime', 'DESC NULLS LAST'],
                ['updatedAt', 'DESC']
            ] as unknown as Order,
        } as any;

        return await paginate(ChatRoom, page, limit, options);
    }

    async findById(id: number) {
        return await ChatRoom.findByPk(id, {
            include: [
                {
                    model: Hotel,
                    attributes: ['id', 'name', 'images']
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'avatar']
                },
                {
                    model: Message,
                    attributes: ['id', 'content', 'senderId', 'createdAt'],
                    where: { isDeleted: false },
                    required: false,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email']
                        }
                    ]
                }
            ]
        });
    }

    async create(chatRoomData: InferCreationAttributes<ChatRoom>) {
        return await ChatRoom.create(chatRoomData);
    }

    async update(id: number, chatRoomData: Partial<ChatRoom>) {
        const chatRoom = await ChatRoom.findByPk(id);
        if (!chatRoom) return null;
        return await chatRoom.update(chatRoomData);
    }

    async delete(id: number) {
        const chatRoom = await ChatRoom.findByPk(id);
        if (!chatRoom) return false;
        await chatRoom.destroy();
        return true;
    }

    async findByUserAndHotel(userId: number, hotelId: number) {
        return await ChatRoom.findOne({
            where: {
                userId,
                hotelId
            },
            include: [
                {
                    model: Hotel,
                    attributes: ['id', 'name', 'images']
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'avatar']
                },
                {
                    model: Message,
                    attributes: ['id', 'content', 'senderId', 'createdAt'],
                    where: { isDeleted: false },
                    required: false,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email']
                        }
                    ]
                }
            ]
        });
    }

    async findByHotelId(hotelId: number, page: number, limit: number): Promise<PaginatedResult<ChatRoom>> {
        const options = {
            where: { hotelId },
            include: [
                {
                    model: Hotel,
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Message,
                    attributes: ['id', 'content', 'senderId', 'createdAt'],
                    required: false,
                    separate: true,
                    where: { isDeleted: false },
                    order: [['id', 'DESC']] as Order,
                    limit: 1,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email']
                        }
                    ]
                }
            ],
            order: [
                ['newMessageTime', 'DESC NULLS LAST'],
                ['updatedAt', 'DESC']
            ] as unknown as Order,
        } as any;

        return await paginate(ChatRoom, page, limit, options);
    }
} 
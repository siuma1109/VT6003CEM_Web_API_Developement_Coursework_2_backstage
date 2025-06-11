import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { ChatRoom } from '../models/chat-room.model';
import { Op, Order } from 'sequelize';
import { InferCreationAttributes } from '@sequelize/core';
import { PaginatedResult } from '../utils/model.util';
import { paginate } from '../utils/model.util';

export class MessageRepository {
    async findAll(options: any = {}) {
        return await Message.findAll({
            ...options,
            where: { isDeleted: false },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
    }

    async paginate(chatRoomId: number, page: number, limit: number): Promise<PaginatedResult<Message>> {
        const options = {
            where: {
                chatRoomId,
                isDeleted: false
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['id', 'ASC']] as Order
        };

        return await paginate(Message, page, limit, options);
    }

    async findById(id: number) {
        return await Message.findOne({
            where: {
                id,
                isDeleted: false
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: ChatRoom,
                    attributes: ['id', 'userId', 'hotelId']
                }
            ]
        });
    }

    async create(messageData: InferCreationAttributes<Message>) {
        return await Message.create(messageData as any);
    }

    async update(id: number, messageData: Partial<Message>) {
        const message = await Message.findOne({
            where: {
                id,
                isDeleted: false
            }
        });
        if (!message) return null;
        return await message.update(messageData);
    }

    async softDelete(id: number) {
        const message = await Message.findOne({
            where: {
                id,
                isDeleted: false
            }
        });
        if (!message) return false;
        await message.update({ isDeleted: true });
        return true;
    }

    async delete(id: number) {
        const message = await Message.findByPk(id);
        if (!message) return false;
        await message.destroy();
        return true;
    }

    async findByChatRoom(chatRoomId: number) {
        return await Message.findAll({
            where: {
                chatRoomId,
                isDeleted: false
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['createdAt', 'ASC']]
        });
    }
} 
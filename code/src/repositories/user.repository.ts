import { InferAttributes, InferCreationAttributes } from '@sequelize/core';
import { User } from '../models/user.model';
import { paginate, PaginatedResult } from '../utils/model.util';
import { Role } from '../models/role.model';

export const UserRepository = {
    paginate: async (page: number, limit: number): Promise<PaginatedResult<User>> => {
        return await paginate(User, page, limit, {
            include: [{
                model: Role,
                through: { attributes: [] }
            }]
        });
    },

    getById: async (id: number) => {
        const user = await User.findByPk(id, {
            include: [{
                model: Role,
                through: { attributes: [] }
            }]
        });
        if (!user) return null;
        return user;
    },

    getByIdWithPassword: async (id: number) => {
        const user = await User.withScope('password').findByPk(id, {
            include: [{
                model: Role,
                through: { attributes: [] }
            }]
        });
        if (!user) return null;
        return user;
    },

    getByEmail: async (email: string) => {
        const user = await User.findOne({
            where: {
                email
            },
            include: [{
                model: Role,
                through: { attributes: [] }
            }]
        });
        if (!user) return null;
        return user;
    },

    getByEmailWithPassword: async (email: string) => {
        const user = await User.withScope('password').findOne({
            where: {
                email
            },
            include: [{
                model: Role,
                through: { attributes: [] }
            }]
        });
        if (!user) return null;
        return user;
    },

    create: async (userData: InferCreationAttributes<User>) => {
        return await User.create(userData);
    },

    update: async (id: number, userData: Partial<InferAttributes<User>>) => {
        const user = await User.findByPk(id);
        if (!user) return null;
        return await user.update(userData);
    },

    delete: async (id: number) => {
        const user = await User.findByPk(id);
        if (!user) return false;
        await user.destroy();
        return true;
    },

    count: async () => {
        return await User.count();
    }
}; 
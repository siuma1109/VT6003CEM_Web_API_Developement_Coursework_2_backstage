import { InferAttributes, InferCreationAttributes } from '@sequelize/core';
import { User } from '../models/user.model';

export const UserRepository = {
    getAll: async () => await User.findAll(),

    getById: async (id: number) => await User.findByPk(id),

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
    }
}; 
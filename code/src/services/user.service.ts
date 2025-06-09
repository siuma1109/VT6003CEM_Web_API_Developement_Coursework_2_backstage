import { InferAttributes, InferCreationAttributes } from "@sequelize/core";
import { User } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";

export const UserService = {
    getAll: async () => {
        const users = await UserRepository.getAll();
        return users;
    },
    getById: async (id: number) => {
        const user = await UserRepository.getById(id);
        return user;
    },
    create: async (user: InferCreationAttributes<User>) => {
        const newUser = await UserRepository.create(user);
        return newUser;
    },
    update: async (id: number, user: InferAttributes<User>) => {
        const updatedUser = await UserRepository.update(id, user);
        return updatedUser;
    },
    delete: async (id: number) => {
        const deletedUser = await UserRepository.delete(id);
        return deletedUser;
    }
}
import { InferAttributes, InferCreationAttributes } from "@sequelize/core";
import { User } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { PaginatedResult } from "../utils/model.util";

export const UserService = {
    getAll: async (page: number, limit: number): Promise<PaginatedResult<User>> => {
        return await UserRepository.paginate(page, limit);
    },
    getById: async (id: number): Promise<User | null> => {
        const user = await UserRepository.getById(id);
        if (!user) {
            return null;
        }
        return user;
    },
    getByIdWithPassword: async (id: number): Promise<User | null> => {
        const user = await UserRepository.getByIdWithPassword(id);
        if (!user) {
            return null;
        }
        return user;
    },
    getByEmail: async (email: string): Promise<User | null> => {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            return null;
        }
        return user;
    },
    getByEmailWithPassword: async (email: string): Promise<User | null> => {
        const user = await UserRepository.getByEmailWithPassword(email);
        if (!user) {
            return null;
        }
        return user;
    },
    create: async (user: object) => {
        const newUser = await UserRepository.create(user as InferAttributes<User>);
        return newUser;
    },
    update: async (id: number, user: object) => {
        const updatedUser = await UserRepository.update(id, user as InferAttributes<User>);
        return updatedUser;
    },
    delete: async (id: number) => {
        const deletedUser = await UserRepository.delete(id);
        return deletedUser;
    }
}
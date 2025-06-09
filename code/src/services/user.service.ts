import { InferAttributes, InferCreationAttributes } from "@sequelize/core";
import { User } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { Request, Response } from "express";
import { apiResponse } from "../utils/api-response.util";
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
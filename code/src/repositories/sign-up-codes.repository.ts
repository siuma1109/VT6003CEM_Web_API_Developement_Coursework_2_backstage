import { SignUpCodes } from '../models/sign-up-codes.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

export class SignUpCodesRepository {
    async findAll() {
        return await SignUpCodes.findAll({
            include: [
                {
                    model: Role,
                    attributes: ['name']
                },
                {
                    model: User,
                    attributes: ['name', 'email']
                }
            ]
        });
    }

    async findByCode(code: string) {
        return await SignUpCodes.findOne({
            where: { code },
            include: [
                {
                    model: Role,
                    attributes: ['name']
                }
            ]
        });
    }

    async create(data: {
        roleId: number;
        code: string;
        expiresAt: Date;
        createdBy: number;
    }) {
        const signUpCode = await SignUpCodes.create(data);
        return await SignUpCodes.findOne({
            where: { id: signUpCode.id },
            include: [
                {
                    model: Role,
                    attributes: ['name']
                },
                {
                    model: User,
                    attributes: ['name', 'email']
                }
            ]
        });
    }

    async delete(id: number) {
        return await SignUpCodes.destroy({
            where: { id }
        });
    }
} 
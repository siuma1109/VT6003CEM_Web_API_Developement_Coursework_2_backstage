import { SignUpCodesRepository } from '../repositories/sign-up-codes.repository';
import { randomBytes } from 'crypto';

export class SignUpCodesService {
    private repository: SignUpCodesRepository;

    constructor() {
        this.repository = new SignUpCodesRepository();
    }

    async getAllCodes() {
        return await this.repository.findAll();
    }

    async generateCode(roleId: number, createdBy: number) {
        // Generate a random 8-character code
        const code = randomBytes(4).toString('hex').toUpperCase();
        
        // Set expiration to 24 hours from now
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        return await this.repository.create({
            roleId,
            code,
            expiresAt,
            createdBy
        });
    }

    async validateCode(code: string) {
        const signUpCode = await this.repository.findByCode(code);
        
        if (!signUpCode) {
            return null;
        }

        if (new Date() > signUpCode.expiresAt) {
            await this.repository.delete(signUpCode.id);
            return null;
        }

        return signUpCode;
    }
} 
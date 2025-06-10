import { SignUpCodesRepository } from '../repositories/sign-up-codes.repository';
import { randomBytes } from 'crypto';

export class SignUpCodesService {
    private repository: SignUpCodesRepository;

    constructor() {
        this.repository = new SignUpCodesRepository();
    }

    /**
     * Get all sign-up codes with their associated role and creator information
     */
    async getAllCodes() {
        return await this.repository.findAll();
    }

    /**
     * Generate a new sign-up code with role and creator information
     * @param roleId The ID of the role to assign
     * @param createdBy The ID of the user creating the code
     */
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

    /**
     * Validate a sign-up code and return it with role information if valid
     * @param code The code to validate
     */
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

    async deleteCode(id: number) {
        return await this.repository.delete(id);
    }
} 
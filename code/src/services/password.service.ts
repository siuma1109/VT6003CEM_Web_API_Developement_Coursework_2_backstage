import bcrypt from 'bcrypt';

export const PasswordService = {
    hash: async (password: string): Promise<string> => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },
    compare: async (password: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(password, hash);
    }
}
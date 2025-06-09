import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { UserTokens } from '../models/user-tokens.model';
import crypto from 'crypto';
import { Response } from 'express';
import { apiResponse } from '../utils/api-response.util';
import { SignUpCodes } from '../models/sign-up-codes.model';
import { Role } from '../models/role.model';

export const initializePassport = () => {
    // Local strategy for email/password login
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await User.withScope('password').findOne({ where: { email } });

                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Bearer strategy for token authentication
    passport.use(new BearerStrategy(
        async (token, done) => {
            try {
                const tokenRecord = await UserTokens.findOne({
                    where: { accessToken: token },
                    include: [{
                        model: User,
                        required: true
                    }]
                });

                if (!tokenRecord) {
                    return done(null, false, 'Invalid token');
                }

                if (tokenRecord.accessTokenExpiresAt < new Date()) {
                    await tokenRecord.destroy();
                    return done(null, false, 'Token has expired');
                }

                return done(null, tokenRecord.user);
            } catch (error) {
                return done(error);
            }
        }
    ));
};

export const generateTokens = async (userId: number): Promise<{ accessToken: string; refreshToken: string }> => {
    const accessToken = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(32).toString('hex');

    const accessTokenExpiresAt = new Date();
    accessTokenExpiresAt.setHours(accessTokenExpiresAt.getHours() + 1); // Access token expires in 1 hour

    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30); // Refresh token expires in 30 days

    await UserTokens.create({
        userId,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt
    });

    return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> => {
    const tokenRecord = await UserTokens.findOne({
        where: { refreshToken }
    });

    if (!tokenRecord || tokenRecord.refreshTokenExpiresAt < new Date()) {
        return null;
    }

    // Generate new tokens
    const newAccessToken = crypto.randomBytes(32).toString('hex');
    const newRefreshToken = crypto.randomBytes(32).toString('hex');

    const accessTokenExpiresAt = new Date();
    accessTokenExpiresAt.setHours(accessTokenExpiresAt.getHours() + 1);

    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30);

    // Update the token record
    await tokenRecord.update({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
};

export const revokeTokens = async (userId: number): Promise<void> => {
    await UserTokens.destroy({
        where: { userId }
    });
};

export const authenticate = (req: any, res: Response, next: any) => {
    passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            return apiResponse(res, 500, 'Internal server error', undefined, undefined, new Map([['error', err.message]]));
        }

        if (!user) {
            return apiResponse(res, 401, 'Unauthorized', undefined, undefined, new Map([['error', info?.message || 'Invalid credentials']]));
        }

        req.user = user;
        next();
    })(req, res, next);
};

export const authenticateToken = (req: any, res: Response, next: any) => {
    passport.authenticate('bearer', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            return apiResponse(res, 500, 'Internal server error', undefined, undefined, new Map([['error', err.message]]));
        }

        if (!user) {
            return apiResponse(res, 401, 'Unauthorized', undefined, undefined, new Map([['error', info?.message || 'Invalid token']]));
        }

        req.user = user;
        next();
    })(req, res, next);
};

export const createSignUpCode = async (user: any) => {
    let code = crypto.randomBytes(4).toString('hex').toUpperCase();
    while (await SignUpCodes.findOne({ where: { code: code } })) {
        code = crypto.randomBytes(4).toString('hex').toUpperCase();
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Code expires in 24 hours

    const operatorRole = await Role.findOne({
        where: {
            name: "travel_agency_operator"
        }
    });

    const newCode = await SignUpCodes.create({
        code,
        roleId: operatorRole!.id || 2, // Assuming 2 is the operator role ID
        expiresAt,
        createdBy: user.id
    });

    return newCode;
};
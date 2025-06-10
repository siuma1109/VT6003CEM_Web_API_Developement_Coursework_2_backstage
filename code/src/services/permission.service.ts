import { Response } from 'express';
import { User } from '../models/user.model';
import { UsersRoles } from '../models/users-roles.model';
import { Role } from '../models/role.model';
import { apiResponse } from '../utils/api-response.util';
import { Op } from 'sequelize';

export const canAddUser = async (req: any, res: Response, next: any) => {
    try {
        const currentUser = req.user;
        //console.log('Current user:', currentUser);
        if (!currentUser) {
            return apiResponse(res, 401, 'Unauthorized', undefined, undefined, new Map([['error', 'User not authenticated']]));
        }

        // Check if user has admin role
        const userRole = await UsersRoles.findOne({
            where: { userId: currentUser.id },
            include: [{
                model: Role,
                where: { name: 'admin' }
            }]
        });

        //console.log('User role query result:', userRole);
        if (userRole) {
            //console.log('User has admin role');
            return next();
        }

        // If no admin role found, let's check what roles the user actually has
        const allUserRoles = await UsersRoles.findAll({
            where: { userId: currentUser.id },
            include: [Role]
        });
        //console.log('All user roles:', allUserRoles);

        return apiResponse(res, 403, 'You do not have permission to access this resource');
    } catch (error: any) {
        console.error('Error checking permissions:', error);
        return apiResponse(res, 403, 'You do not have permission to access this resource');
    }
};


export const canUpdateOrDeleteUser = async (req: any, res: Response, next: any) => {
    try {
        let targetUserId = req.params.id;
        if(targetUserId === 'me') {
            const user = req.user as User;
            if (!user) {
                return apiResponse(res, 401, 'User not authenticated');
            }
            targetUserId = user.id;
        }
        const currentUser = req.user;

        if (!currentUser) {
            return apiResponse(res, 401, 'Unauthorized');
        }

        // Check if user is accessing their own data
        if (currentUser.id === Number(targetUserId)) {
            return next();
        }

        // Check if user has admin role
        const userRole = await UsersRoles.findOne({
            where: { userId: currentUser.id },
            include: [{
                model: Role,
                where: { name: 'admin' }
            }]
        });

        if (userRole) {
            return next();
        }

        return apiResponse(res, 403, 'You do not have permission to access this resource');
    } catch (error) {
        return apiResponse(res, 403, 'You do not have permission to access this resource');
    }
};

export const isAdmin = async (req: any, res: Response, next: any) => {
    try {
        const currentUser = req.user;
        //console.log('Current user:', currentUser);
        if (!currentUser) {
            return apiResponse(res, 401, 'Unauthorized', undefined, undefined, new Map([['error', 'User not authenticated']]));
        }

        // Check if user has admin role
        const userRole = await UsersRoles.findOne({
            where: { userId: currentUser.id },
            include: [{
                model: Role,
                where: { name: 'admin' }
            }]
        });

        //console.log('User role query result:', userRole);
        if (userRole) {
            console.log('User has admin role');
            return next();
        }

        return apiResponse(res, 403, 'You do not have permission to access this resource');
    } catch (error: any) {
        console.error('Error checking permissions:', error);
        return apiResponse(res, 403, 'You do not have permission to access this resource');
    }
}

export const canManageHotels = async (req: any, res: Response, next: any) => {
    try {
        const currentUser = req.user;
        if (!currentUser) {
            return apiResponse(res, 401, 'Unauthorized', undefined, undefined, new Map([['error', 'User not authenticated']]));
        }

        // Check if user has admin or travel_agency_operator role
        const userRole = await UsersRoles.findOne({
            where: { userId: currentUser.id },
            include: [{
                model: Role,
                where: {
                    name: {
                        [Op.in]: ['admin', 'travel_agency_operator']
                    }
                }
            }]
        });

        if (userRole) {
            return next();
        }

        return apiResponse(res, 403, 'You do not have permission to manage hotels');
    } catch (error: any) {
        console.error('Error checking hotel permissions:', error);
        return apiResponse(res, 403, 'You do not have permission to manage hotels');
    }
};
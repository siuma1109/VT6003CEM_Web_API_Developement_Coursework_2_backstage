import { Request, Response } from 'express';
import { Role } from '../models/role.model';
import { apiResponse } from '../utils/api-response.util';

export const getAllRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Role.findAll();
        return apiResponse(res, 200, 'Roles retrieved successfully', undefined, roles);
    } catch (error: any) {
        console.error('Error retrieving roles:', error);
        return apiResponse(res, 500, 'Error retrieving roles', undefined, undefined, new Map([['error', error.message]]));
    }
};

export const getRoleById = async (req: Request, res: Response) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return apiResponse(res, 404, 'Role not found');
        }
        return apiResponse(res, 200, 'Role retrieved successfully', undefined, role);
    } catch (error: any) {
        console.error('Error retrieving role:', error);
        return apiResponse(res, 500, 'Error retrieving role', undefined, undefined, new Map([['error', error.message]]));
    }
};

export const createRole = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        
        // Check if role with same name already exists
        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) {
            return apiResponse(res, 400, 'Role with this name already exists');
        }

        const role = await Role.create({ name });
        return apiResponse(res, 201, 'Role created successfully', undefined, role);
    } catch (error: any) {
        console.error('Error creating role:', error);
        return apiResponse(res, 500, 'Error creating role', undefined, undefined, new Map([['error', error.message]]));
    }
};

export const updateRole = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const role = await Role.findByPk(req.params.id);
        
        if (!role) {
            return apiResponse(res, 404, 'Role not found');
        }

        // Check if new name conflicts with existing role
        if (name !== role.name) {
            const existingRole = await Role.findOne({ where: { name } });
            if (existingRole) {
                return apiResponse(res, 400, 'Role with this name already exists');
            }
        }

        await role.update({ name });
        return apiResponse(res, 200, 'Role updated successfully', undefined, role);
    } catch (error: any) {
        console.error('Error updating role:', error);
        return apiResponse(res, 500, 'Error updating role', undefined, undefined, new Map([['error', error.message]]));
    }
};

export const deleteRole = async (req: Request, res: Response) => {
    try {
        const role = await Role.findByPk(req.params.id);
        
        if (!role) {
            return apiResponse(res, 404, 'Role not found');
        }

        // Check if role is 'admin' or 'travel_agency_operator' as these are system roles
        if (role.name === 'admin' || role.name === 'travel_agency_operator') {
            return apiResponse(res, 400, 'Cannot delete system roles');
        }

        await role.destroy();
        return apiResponse(res, 200, 'Role deleted successfully');
    } catch (error: any) {
        console.error('Error deleting role:', error);
        return apiResponse(res, 500, 'Error deleting role', undefined, undefined, new Map([['error', error.message]]));
    }
}; 
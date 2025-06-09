import { Router, Request, Response, RequestHandler } from 'express';
import { User } from '../../models/user.model';
import { InferAttributes, InferCreationAttributes } from '@sequelize/core';
import { UserService } from '../../services/user.service';

const router = Router();

// Get all users
router.get('/', (async (req: Request, res: Response) => {
    const users = await UserService.getAll();
    res.json(users);
}) as RequestHandler);

// Get user by ID
router.get('/:id', (async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = await UserService.getById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
}) as RequestHandler);

// Create new user
router.post('/', (async (req: Request, res: Response) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    try {
        const newUser = await UserService.create({ name, email } as InferCreationAttributes<User>);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
}) as RequestHandler);

// Update user
router.put('/:id', (async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const updatedUser = await UserService.update(id, { name, email } as InferAttributes<User>);
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
}) as RequestHandler);

// Delete user
router.delete('/:id', (async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const success = await UserService.delete(id);
    if (!success) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
}) as RequestHandler);

export default router;

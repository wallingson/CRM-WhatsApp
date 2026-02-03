import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';

export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: users });
    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch user' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password, role, avatar, isActive } = req.body;

      const updateData: any = { name, email, role, avatar, isActive };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          isActive: true,
          updatedAt: true,
        },
      });

      res.json({ success: true, data: user });
    } catch (error) {
      logger.error('Update user error:', error);
      res.status(500).json({ success: false, error: 'Failed to update user' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.user.delete({ where: { id } });

      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      logger.error('Delete user error:', error);
      res.status(500).json({ success: false, error: 'Failed to delete user' });
    }
  }
}

import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';

export class TaskController {
  async getAll(req: Request, res: Response) {
    try {
      const { assignedTo, status, leadId } = req.query;
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      const where: any = {};

      if (userRole === 'AGENT') {
        where.assignedTo = userId;
      } else if (assignedTo) {
        where.assignedTo = assignedTo;
      }

      if (status) where.status = status;
      if (leadId) where.leadId = leadId;

      const tasks = await prisma.task.findMany({
        where,
        include: {
          lead: {
            select: { id: true, name: true, phone: true },
          },
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
        orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
      });

      res.json({ success: true, data: tasks });
    } catch (error) {
      logger.error('Get tasks error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const task = await prisma.task.findUnique({
        where: { id },
        include: {
          lead: {
            select: { id: true, name: true, phone: true },
          },
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      });

      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }

      res.json({ success: true, data: task });
    } catch (error) {
      logger.error('Get task error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch task' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { title, description, leadId, assignedTo, dueDate, priority } = req.body;

      const task = await prisma.task.create({
        data: {
          title,
          description,
          leadId,
          assignedTo,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          priority: priority || 'MEDIUM',
        },
        include: {
          lead: {
            select: { id: true, name: true, phone: true },
          },
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      });

      res.status(201).json({ success: true, data: task });
    } catch (error) {
      logger.error('Create task error:', error);
      res.status(500).json({ success: false, error: 'Failed to create task' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, assignedTo, dueDate, priority, status } = req.body;

      const task = await prisma.task.update({
        where: { id },
        data: {
          title,
          description,
          assignedTo,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          priority,
          status,
        },
        include: {
          lead: {
            select: { id: true, name: true, phone: true },
          },
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      });

      res.json({ success: true, data: task });
    } catch (error) {
      logger.error('Update task error:', error);
      res.status(500).json({ success: false, error: 'Failed to update task' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.task.delete({ where: { id } });

      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      logger.error('Delete task error:', error);
      res.status(500).json({ success: false, error: 'Failed to delete task' });
    }
  }
}

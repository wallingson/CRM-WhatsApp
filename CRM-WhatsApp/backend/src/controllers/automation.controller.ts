import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';

export class AutomationController {
  async getAll(req: Request, res: Response) {
    try {
      const automations = await prisma.automation.findMany({
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: automations });
    } catch (error) {
      logger.error('Get automations error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch automations' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const automation = await prisma.automation.findUnique({
        where: { id },
      });

      if (!automation) {
        return res.status(404).json({ success: false, error: 'Automation not found' });
      }

      res.json({ success: true, data: automation });
    } catch (error) {
      logger.error('Get automation error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch automation' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, description, trigger, conditions, actions } = req.body;

      const automation = await prisma.automation.create({
        data: {
          name,
          description,
          trigger,
          conditions,
          actions,
        },
      });

      res.status(201).json({ success: true, data: automation });
    } catch (error) {
      logger.error('Create automation error:', error);
      res.status(500).json({ success: false, error: 'Failed to create automation' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, trigger, conditions, actions } = req.body;

      const automation = await prisma.automation.update({
        where: { id },
        data: {
          name,
          description,
          trigger,
          conditions,
          actions,
        },
      });

      res.json({ success: true, data: automation });
    } catch (error) {
      logger.error('Update automation error:', error);
      res.status(500).json({ success: false, error: 'Failed to update automation' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.automation.delete({ where: { id } });

      res.json({ success: true, message: 'Automation deleted successfully' });
    } catch (error) {
      logger.error('Delete automation error:', error);
      res.status(500).json({ success: false, error: 'Failed to delete automation' });
    }
  }

  async toggle(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const automation = await prisma.automation.findUnique({ where: { id } });
      if (!automation) {
        return res.status(404).json({ success: false, error: 'Automation not found' });
      }

      const updated = await prisma.automation.update({
        where: { id },
        data: { isActive: !automation.isActive },
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      logger.error('Toggle automation error:', error);
      res.status(500).json({ success: false, error: 'Failed to toggle automation' });
    }
  }
}

import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';

export class LeadController {
  async getAll(req: Request, res: Response) {
    try {
      const { status, stageId, assignedTo, search } = req.query;

      const where: any = {};

      if (status) where.status = status;
      if (stageId) where.stageId = stageId;
      if (assignedTo) where.assignedTo = assignedTo;
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const leads = await prisma.lead.findMany({
        where,
        include: {
          stage: true,
          assigned: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          _count: {
            select: { messages: true, tasks: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: leads });
    } catch (error) {
      logger.error('Get leads error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch leads' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
          stage: true,
          assigned: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 50,
          },
          tasks: {
            orderBy: { createdAt: 'desc' },
          },
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: {
              user: {
                select: { id: true, name: true, avatar: true },
              },
            },
          },
        },
      });

      if (!lead) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }

      res.json({ success: true, data: lead });
    } catch (error) {
      logger.error('Get lead error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch lead' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, phone, email, source, tags, customFields } = req.body;
      const userId = req.user!.userId;

      const lead = await prisma.lead.create({
        data: {
          name,
          phone,
          email,
          source,
          tags: tags || [],
          customFields,
          createdBy: userId,
        },
        include: {
          stage: true,
          assigned: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      });

      await prisma.activity.create({
        data: {
          leadId: lead.id,
          userId,
          type: 'NOTE',
          description: 'Lead criado',
        },
      });

      res.status(201).json({ success: true, data: lead });
    } catch (error) {
      logger.error('Create lead error:', error);
      res.status(500).json({ success: false, error: 'Failed to create lead' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, phone, email, source, status, tags, customFields } = req.body;
      const userId = req.user!.userId;

      const lead = await prisma.lead.update({
        where: { id },
        data: {
          name,
          phone,
          email,
          source,
          status,
          tags,
          customFields,
        },
        include: {
          stage: true,
          assigned: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      });

      await prisma.activity.create({
        data: {
          leadId: id,
          userId,
          type: 'NOTE',
          description: 'Lead atualizado',
        },
      });

      res.json({ success: true, data: lead });
    } catch (error) {
      logger.error('Update lead error:', error);
      res.status(500).json({ success: false, error: 'Failed to update lead' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.lead.delete({ where: { id } });

      res.json({ success: true, message: 'Lead deleted successfully' });
    } catch (error) {
      logger.error('Delete lead error:', error);
      res.status(500).json({ success: false, error: 'Failed to delete lead' });
    }
  }

  async assign(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId: assignedTo } = req.body;
      const userId = req.user!.userId;

      const lead = await prisma.lead.update({
        where: { id },
        data: { assignedTo },
        include: {
          assigned: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      });

      await prisma.activity.create({
        data: {
          leadId: id,
          userId,
          type: 'ASSIGNMENT',
          description: `Lead atribuído para ${lead.assigned?.name}`,
        },
      });

      res.json({ success: true, data: lead });
    } catch (error) {
      logger.error('Assign lead error:', error);
      res.status(500).json({ success: false, error: 'Failed to assign lead' });
    }
  }

  async moveStage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { stageId } = req.body;
      const userId = req.user!.userId;

      const stage = await prisma.stage.findUnique({ where: { id: stageId } });
      if (!stage) {
        return res.status(404).json({ success: false, error: 'Stage not found' });
      }

      const lead = await prisma.lead.update({
        where: { id },
        data: { stageId },
        include: {
          stage: true,
          assigned: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      });

      await prisma.activity.create({
        data: {
          leadId: id,
          userId,
          type: 'STAGE_CHANGE',
          description: `Movido para ${stage.name}`,
        },
      });

      res.json({ success: true, data: lead });
    } catch (error) {
      logger.error('Move stage error:', error);
      res.status(500).json({ success: false, error: 'Failed to move lead' });
    }
  }
}

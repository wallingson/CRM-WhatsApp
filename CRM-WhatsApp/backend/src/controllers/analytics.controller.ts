import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';

export class AnalyticsController {
  async getOverview(req: Request, res: Response) {
    try {
      const [
        totalLeads,
        totalMessages,
        totalTasks,
        pendingTasks,
        wonLeads,
        lostLeads,
      ] = await Promise.all([
        prisma.lead.count(),
        prisma.message.count(),
        prisma.task.count(),
        prisma.task.count({ where: { status: 'PENDING' } }),
        prisma.lead.count({ where: { status: 'WON' } }),
        prisma.lead.count({ where: { status: 'LOST' } }),
      ]);

      const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

      res.json({
        success: true,
        data: {
          totalLeads,
          totalMessages,
          totalTasks,
          pendingTasks,
          wonLeads,
          lostLeads,
          conversionRate: Number(conversionRate.toFixed(2)),
        },
      });
    } catch (error) {
      logger.error('Get overview error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch overview' });
    }
  }

  async getLeadsByStage(req: Request, res: Response) {
    try {
      const stages = await prisma.stage.findMany({
        include: {
          _count: {
            select: { leads: true },
          },
          pipeline: {
            select: { name: true },
          },
        },
      });

      const data = stages.map((stage) => ({
        stageId: stage.id,
        stageName: stage.name,
        pipelineName: stage.pipeline.name,
        color: stage.color,
        count: stage._count.leads,
      }));

      res.json({ success: true, data });
    } catch (error) {
      logger.error('Get leads by stage error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch leads by stage' });
    }
  }

  async getConversionRate(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const where: any = {};
      if (startDate && endDate) {
        where.createdAt = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      const [total, won, lost] = await Promise.all([
        prisma.lead.count({ where }),
        prisma.lead.count({ where: { ...where, status: 'WON' } }),
        prisma.lead.count({ where: { ...where, status: 'LOST' } }),
      ]);

      const conversionRate = total > 0 ? (won / total) * 100 : 0;
      const lossRate = total > 0 ? (lost / total) * 100 : 0;

      res.json({
        success: true,
        data: {
          total,
          won,
          lost,
          conversionRate: Number(conversionRate.toFixed(2)),
          lossRate: Number(lossRate.toFixed(2)),
        },
      });
    } catch (error) {
      logger.error('Get conversion rate error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch conversion rate' });
    }
  }

  async getTeamPerformance(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          email: true,
          _count: {
            select: {
              assignedLeads: true,
              tasks: true,
            },
          },
        },
      });

      const performance = await Promise.all(
        users.map(async (user) => {
          const [wonLeads, completedTasks] = await Promise.all([
            prisma.lead.count({
              where: { assignedTo: user.id, status: 'WON' },
            }),
            prisma.task.count({
              where: { assignedTo: user.id, status: 'COMPLETED' },
            }),
          ]);

          return {
            userId: user.id,
            userName: user.name,
            email: user.email,
            totalLeads: user._count.assignedLeads,
            wonLeads,
            totalTasks: user._count.tasks,
            completedTasks,
          };
        })
      );

      res.json({ success: true, data: performance });
    } catch (error) {
      logger.error('Get team performance error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch team performance' });
    }
  }
}

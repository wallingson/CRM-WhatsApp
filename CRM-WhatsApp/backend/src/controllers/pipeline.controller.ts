import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';

export class PipelineController {
  async getAll(req: Request, res: Response) {
    try {
      const pipelines = await prisma.pipeline.findMany({
        include: {
          stages: {
            orderBy: { order: 'asc' },
            include: {
              _count: {
                select: { leads: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: pipelines });
    } catch (error) {
      logger.error('Get pipelines error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch pipelines' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const pipeline = await prisma.pipeline.findUnique({
        where: { id },
        include: {
          stages: {
            orderBy: { order: 'asc' },
            include: {
              leads: {
                include: {
                  assigned: {
                    select: { id: true, name: true, avatar: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!pipeline) {
        return res.status(404).json({ success: false, error: 'Pipeline not found' });
      }

      res.json({ success: true, data: pipeline });
    } catch (error) {
      logger.error('Get pipeline error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch pipeline' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, stages } = req.body;

      const pipeline = await prisma.pipeline.create({
        data: {
          name,
          stages: {
            create: stages.map((stage: any, index: number) => ({
              name: stage.name,
              color: stage.color || '#6366f1',
              order: index,
            })),
          },
        },
        include: {
          stages: {
            orderBy: { order: 'asc' },
          },
        },
      });

      res.status(201).json({ success: true, data: pipeline });
    } catch (error) {
      logger.error('Create pipeline error:', error);
      res.status(500).json({ success: false, error: 'Failed to create pipeline' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, stages } = req.body;

      if (stages) {
        await prisma.stage.deleteMany({ where: { pipelineId: id } });
      }

      const pipeline = await prisma.pipeline.update({
        where: { id },
        data: {
          name,
          ...(stages && {
            stages: {
              create: stages.map((stage: any, index: number) => ({
                name: stage.name,
                color: stage.color || '#6366f1',
                order: index,
              })),
            },
          }),
        },
        include: {
          stages: {
            orderBy: { order: 'asc' },
          },
        },
      });

      res.json({ success: true, data: pipeline });
    } catch (error) {
      logger.error('Update pipeline error:', error);
      res.status(500).json({ success: false, error: 'Failed to update pipeline' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.pipeline.delete({ where: { id } });

      res.json({ success: true, message: 'Pipeline deleted successfully' });
    } catch (error) {
      logger.error('Delete pipeline error:', error);
      res.status(500).json({ success: false, error: 'Failed to delete pipeline' });
    }
  }
}

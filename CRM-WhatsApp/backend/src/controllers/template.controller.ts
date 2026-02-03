import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';

export class TemplateController {
  async getAll(req: Request, res: Response) {
    try {
      const { category, isActive } = req.query;

      const where: any = {};
      if (category) where.category = category;
      if (isActive !== undefined) where.isActive = isActive === 'true';

      const templates = await prisma.template.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: templates });
    } catch (error) {
      logger.error('Get templates error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch templates' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const template = await prisma.template.findUnique({
        where: { id },
      });

      if (!template) {
        return res.status(404).json({ success: false, error: 'Template not found' });
      }

      res.json({ success: true, data: template });
    } catch (error) {
      logger.error('Get template error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch template' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, content, category, variables, mediaUrl } = req.body;

      const template = await prisma.template.create({
        data: {
          name,
          content,
          category,
          variables: variables || [],
          mediaUrl,
        },
      });

      res.status(201).json({ success: true, data: template });
    } catch (error) {
      logger.error('Create template error:', error);
      res.status(500).json({ success: false, error: 'Failed to create template' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, content, category, variables, mediaUrl, isActive } = req.body;

      const template = await prisma.template.update({
        where: { id },
        data: {
          name,
          content,
          category,
          variables,
          mediaUrl,
          isActive,
        },
      });

      res.json({ success: true, data: template });
    } catch (error) {
      logger.error('Update template error:', error);
      res.status(500).json({ success: false, error: 'Failed to update template' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.template.delete({ where: { id } });

      res.json({ success: true, message: 'Template deleted successfully' });
    } catch (error) {
      logger.error('Delete template error:', error);
      res.status(500).json({ success: false, error: 'Failed to delete template' });
    }
  }
}

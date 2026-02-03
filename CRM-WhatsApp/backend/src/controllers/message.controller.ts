import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';
import { WhatsAppService } from '../services/whatsapp.service';

const whatsappService = new WhatsAppService();

export class MessageController {
  async getByLead(req: Request, res: Response) {
    try {
      const { leadId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const messages = await prisma.message.findMany({
        where: { leadId },
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: Number(offset),
      });

      res.json({ success: true, data: messages });
    } catch (error) {
      logger.error('Get messages error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
  }

  async send(req: Request, res: Response) {
    try {
      const { leadId, content, messageType, mediaUrl } = req.body;
      const userId = req.user!.userId;

      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }

      const whatsappResponse = await whatsappService.sendMessage(
        lead.phone,
        content,
        messageType,
        mediaUrl
      );

      const message = await prisma.message.create({
        data: {
          leadId,
          userId,
          content,
          messageType: messageType || 'TEXT',
          direction: 'OUTBOUND',
          whatsappId: whatsappResponse.messages[0].id,
          status: 'SENT',
          mediaUrl,
        },
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      });

      const io = (req as any).io;
      io.to(`lead-${leadId}`).emit('new-message', message);

      res.status(201).json({ success: true, data: message });
    } catch (error) {
      logger.error('Send message error:', error);
      res.status(500).json({ success: false, error: 'Failed to send message' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const message = await prisma.message.update({
        where: { id },
        data: { status },
      });

      res.json({ success: true, data: message });
    } catch (error) {
      logger.error('Update message status error:', error);
      res.status(500).json({ success: false, error: 'Failed to update message status' });
    }
  }
}

import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';
import { WhatsAppService } from '../services/whatsapp.service';

const whatsappService = new WhatsAppService();

export class WhatsAppWebhookController {
  async verify(req: Request, res: Response) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      logger.info('WhatsApp webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      const body = req.body;

      if (body.object !== 'whatsapp_business_account') {
        return res.sendStatus(404);
      }

      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            await this.handleMessage(change.value);
          } else if (change.field === 'message_status') {
            await this.handleMessageStatus(change.value);
          }
        }
      }

      res.sendStatus(200);
    } catch (error) {
      logger.error('Webhook error:', error);
      res.sendStatus(500);
    }
  }

  private async handleMessage(value: any) {
    try {
      const { messages, contacts } = value;

      if (!messages || messages.length === 0) return;

      for (const message of messages) {
        const contact = contacts.find((c: any) => c.wa_id === message.from);
        const phone = message.from;
        const contactName = contact?.profile?.name || phone;

        let lead = await prisma.lead.findUnique({ where: { phone } });

        if (!lead) {
          const defaultUser = await prisma.user.findFirst({
            where: { role: 'ADMIN' },
          });

          lead = await prisma.lead.create({
            data: {
              name: contactName,
              phone,
              source: 'whatsapp',
              createdBy: defaultUser!.id,
            },
          });

          logger.info('New lead created from WhatsApp', { leadId: lead.id, phone });
        }

        let content = '';
        let messageType = 'TEXT';
        let mediaUrl = null;

        if (message.type === 'text') {
          content = message.text.body;
          messageType = 'TEXT';
        } else if (message.type === 'image') {
          content = message.image.caption || 'Imagem recebida';
          messageType = 'IMAGE';
          mediaUrl = message.image.id;
        } else if (message.type === 'video') {
          content = message.video.caption || 'Vídeo recebido';
          messageType = 'VIDEO';
          mediaUrl = message.video.id;
        } else if (message.type === 'audio') {
          content = 'Áudio recebido';
          messageType = 'AUDIO';
          mediaUrl = message.audio.id;
        } else if (message.type === 'document') {
          content = message.document.caption || message.document.filename || 'Documento recebido';
          messageType = 'DOCUMENT';
          mediaUrl = message.document.id;
        } else if (message.type === 'location') {
          content = `Localização: ${message.location.latitude}, ${message.location.longitude}`;
          messageType = 'LOCATION';
        }

        const newMessage = await prisma.message.create({
          data: {
            leadId: lead.id,
            content,
            messageType,
            direction: 'INBOUND',
            whatsappId: message.id,
            status: 'DELIVERED',
            mediaUrl,
            metadata: { timestamp: message.timestamp },
          },
          include: {
            lead: true,
          },
        });

        await whatsappService.markAsRead(message.id);

        logger.info('New message received from WhatsApp', {
          messageId: newMessage.id,
          leadId: lead.id,
        });
      }
    } catch (error) {
      logger.error('Handle message error:', error);
    }
  }

  private async handleMessageStatus(value: any) {
    try {
      const { statuses } = value;

      if (!statuses || statuses.length === 0) return;

      for (const status of statuses) {
        const whatsappId = status.id;
        let messageStatus = 'SENT';

        if (status.status === 'delivered') {
          messageStatus = 'DELIVERED';
        } else if (status.status === 'read') {
          messageStatus = 'READ';
        } else if (status.status === 'failed') {
          messageStatus = 'FAILED';
        }

        await prisma.message.updateMany({
          where: { whatsappId },
          data: { status: messageStatus as any },
        });

        logger.info('Message status updated', { whatsappId, status: messageStatus });
      }
    } catch (error) {
      logger.error('Handle message status error:', error);
    }
  }
}

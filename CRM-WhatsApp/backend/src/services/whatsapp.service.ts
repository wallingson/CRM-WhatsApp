import axios from 'axios';
import { logger } from '../utils/logger';

export class WhatsAppService {
  private apiUrl: string;
  private phoneNumberId: string;
  private accessToken: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
  }

  async sendMessage(to: string, content: string, type: string = 'text', mediaUrl?: string) {
    try {
      const phoneNumber = to.replace(/\D/g, '');

      let messageData: any = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
      };

      if (type === 'text' || type === 'TEXT') {
        messageData.type = 'text';
        messageData.text = { body: content };
      } else if (type === 'image' || type === 'IMAGE') {
        messageData.type = 'image';
        messageData.image = {
          link: mediaUrl,
          caption: content || '',
        };
      } else if (type === 'document' || type === 'DOCUMENT') {
        messageData.type = 'document';
        messageData.document = {
          link: mediaUrl,
          caption: content || '',
        };
      } else if (type === 'video' || type === 'VIDEO') {
        messageData.type = 'video';
        messageData.video = {
          link: mediaUrl,
          caption: content || '',
        };
      } else if (type === 'audio' || type === 'AUDIO') {
        messageData.type = 'audio';
        messageData.audio = { link: mediaUrl };
      }

      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('WhatsApp message sent successfully', { to, messageId: response.data.messages[0].id });
      return response.data;
    } catch (error: any) {
      logger.error('WhatsApp send message error:', error.response?.data || error.message);
      throw new Error('Failed to send WhatsApp message');
    }
  }

  async sendTemplate(to: string, templateName: string, languageCode: string = 'pt_BR', components?: any[]) {
    try {
      const phoneNumber = to.replace(/\D/g, '');

      const messageData = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components: components || [],
        },
      };

      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('WhatsApp template sent successfully', { to, templateName });
      return response.data;
    } catch (error: any) {
      logger.error('WhatsApp send template error:', error.response?.data || error.message);
      throw new Error('Failed to send WhatsApp template');
    }
  }

  async markAsRead(messageId: string) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('WhatsApp mark as read error:', error.response?.data || error.message);
    }
  }
}

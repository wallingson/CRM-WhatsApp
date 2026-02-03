import { Router } from 'express';
import { WhatsAppWebhookController } from '../controllers/whatsapp.controller';

const router = Router();
const whatsappController = new WhatsAppWebhookController();

router.get('/webhook', whatsappController.verify);
router.post('/webhook', whatsappController.handleWebhook);

export default router;

import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const messageController = new MessageController();

router.use(authenticateToken);

router.get('/lead/:leadId', messageController.getByLead);
router.post('/send', messageController.send);
router.put('/:id/status', messageController.updateStatus);

export default router;

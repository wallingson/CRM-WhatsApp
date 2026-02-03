import { Router } from 'express';
import { AutomationController } from '../controllers/automation.controller';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();
const automationController = new AutomationController();

router.use(authenticateToken);

router.get('/', automationController.getAll);
router.get('/:id', automationController.getById);
router.post('/', authorize('ADMIN', 'MANAGER'), automationController.create);
router.put('/:id', authorize('ADMIN', 'MANAGER'), automationController.update);
router.delete('/:id', authorize('ADMIN'), automationController.delete);
router.post('/:id/toggle', authorize('ADMIN', 'MANAGER'), automationController.toggle);

export default router;

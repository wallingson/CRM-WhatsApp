import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const leadController = new LeadController();

router.use(authenticateToken);

router.get('/', leadController.getAll);
router.get('/:id', leadController.getById);
router.post('/', leadController.create);
router.put('/:id', leadController.update);
router.delete('/:id', leadController.delete);
router.post('/:id/assign', leadController.assign);
router.post('/:id/move-stage', leadController.moveStage);

export default router;

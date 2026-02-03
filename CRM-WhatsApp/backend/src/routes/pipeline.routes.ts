import { Router } from 'express';
import { PipelineController } from '../controllers/pipeline.controller';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();
const pipelineController = new PipelineController();

router.use(authenticateToken);

router.get('/', pipelineController.getAll);
router.get('/:id', pipelineController.getById);
router.post('/', authorize('ADMIN', 'MANAGER'), pipelineController.create);
router.put('/:id', authorize('ADMIN', 'MANAGER'), pipelineController.update);
router.delete('/:id', authorize('ADMIN'), pipelineController.delete);

export default router;

import { Router } from 'express';
import { TemplateController } from '../controllers/template.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const templateController = new TemplateController();

router.use(authenticateToken);

router.get('/', templateController.getAll);
router.get('/:id', templateController.getById);
router.post('/', templateController.create);
router.put('/:id', templateController.update);
router.delete('/:id', templateController.delete);

export default router;

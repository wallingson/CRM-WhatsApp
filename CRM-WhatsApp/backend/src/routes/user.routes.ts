import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();
const userController = new UserController();

router.use(authenticateToken);

router.get('/', authorize('ADMIN', 'MANAGER'), userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', authorize('ADMIN'), userController.delete);

export default router;

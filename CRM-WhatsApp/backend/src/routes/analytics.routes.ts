import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const analyticsController = new AnalyticsController();

router.use(authenticateToken);

router.get('/overview', analyticsController.getOverview);
router.get('/leads-by-stage', analyticsController.getLeadsByStage);
router.get('/conversion-rate', analyticsController.getConversionRate);
router.get('/team-performance', analyticsController.getTeamPerformance);

export default router;

import express from 'express';
import dashboardController from '../../controllers/Admin/dashboard.controller';

const router = express.Router();

router.get('/', dashboardController.getDashboard);

export default router;

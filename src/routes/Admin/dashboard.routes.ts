import express from 'express';
import dashboardController from '../../controllers/Admin/dashboard.controller';

const router = express.Router();

const dashboardControllerIns = new dashboardController();

router.get('/dashboard', dashboardControllerIns.getDashboard);

export default router;

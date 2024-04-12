import express from 'express';

import credAdminRoutes from './Admin/cred.routes';
import dashboardAdminRoutes from './Admin/dashboard.routes';

const router = express.Router();

router.use('/', credAdminRoutes);
router.use('/', dashboardAdminRoutes);

export default router;

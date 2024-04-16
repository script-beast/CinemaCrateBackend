import express from 'express';

import credAdminRoutes from './Admin/cred.routes';
import dashboardAdminRoutes from './Admin/dashboard.routes';
import crateAdminRoutes from './Admin/crate.routes';

import adminAuth from '../middlewares/admin.auth';

const router = express.Router();

router.use('/', credAdminRoutes);
router.use('/', adminAuth, dashboardAdminRoutes);
router.use('/crate', adminAuth, crateAdminRoutes);

export default router;

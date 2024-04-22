import express from 'express';

import credAdminRoutes from './Admin/cred.routes';
import dashboardAdminRoutes from './Admin/dashboard.routes';
import crateAdminRoutes from './Admin/crates.routes';
import limitedCratesAdminRoutes from './Admin/limitedCrates.routes';
import orderAdminRoutes from './Admin/orders.routes';
import premiumCratesAdminRoutes from './Admin/premiumCrates.routes';
import storeAdminRoutes from './Admin/stores.routes';
import transactionAdminRoutes from './Admin/transactions.routes';

import adminAuth from '../middlewares/admin.auth';

const router = express.Router();

router.use('/', credAdminRoutes);
router.use('/dashboard', adminAuth, dashboardAdminRoutes);
router.use('/crates', adminAuth, crateAdminRoutes);
router.use('/limited-crates', adminAuth, limitedCratesAdminRoutes);
router.use('/orders', adminAuth, orderAdminRoutes);
router.use('/premium-crates', adminAuth, premiumCratesAdminRoutes);
router.use('/stores', adminAuth, storeAdminRoutes);
router.use('/transactions', adminAuth, transactionAdminRoutes);

export default router;

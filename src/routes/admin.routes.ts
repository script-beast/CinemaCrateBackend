import express from 'express';

import credAdminRoutes from './Admin/cred.routes';
import userAdminRoutes from './Admin/user.routes';
import dashboardAdminRoutes from './Admin/dashboard.routes';
import crateAdminRoutes from './Admin/crates.routes';
import limitedCratesAdminRoutes from './Admin/limitedCrates.routes';
import orderAdminRoutes from './Admin/orders.routes';
import premiumCratesAdminRoutes from './Admin/premiumCrates.routes';
import storeAdminRoutes from './Admin/stores.routes';
import transactionAdminRoutes from './Admin/transactions.routes';
import contactAdminRoutes from './Admin/contact.routes';

import adminAuth from '../middlewares/admin.auth';

const router = express.Router();

router.use('/', credAdminRoutes);
router.use('/users', adminAuth, userAdminRoutes);
router.use('/dashboard', adminAuth, dashboardAdminRoutes);
router.use('/crates/standard', adminAuth, crateAdminRoutes);
router.use('/crates/limited', adminAuth, limitedCratesAdminRoutes);
router.use('/crates/premium', adminAuth, premiumCratesAdminRoutes);
router.use('/orders', adminAuth, orderAdminRoutes);
router.use('/stores', adminAuth, storeAdminRoutes);
router.use('/transactions', adminAuth, transactionAdminRoutes);
router.use('/contacts', adminAuth, contactAdminRoutes);

export default router;

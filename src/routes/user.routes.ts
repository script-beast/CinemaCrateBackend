import express from 'express';

import cartUserRoutes from './User/cart.routes';
import credUserRoutes from './User/cred.routes';
import profileUserRoutes from './User/profile.routes';
import crateUserRoutes from './User/crate.routes';
import limitedCrateUserRoutes from './User/limitedCrate.routes';
import premiumCrateUserRoutes from './User/premiumCrate.routes';
import storeUserRoutes from './User/store.routes';
import contactUserRoutes from './User/contact.routes';

import userAuth from '../middlewares/user.auth';

const router = express.Router();

router.use('/', credUserRoutes);
router.use('/cart', userAuth, cartUserRoutes);
router.use('/profile', userAuth, profileUserRoutes);
router.use('/crates/standard', crateUserRoutes);
router.use('/crates/limited', limitedCrateUserRoutes);
router.use('/crates/premium', premiumCrateUserRoutes);
router.use('/stores', userAuth, storeUserRoutes);
router.use('/contacts', contactUserRoutes);

export default router;

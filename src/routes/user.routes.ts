import express from 'express';

import credUserRoutes from './User/cred.routes';
import profileUserRoutes from './User/profile.routes';
import crateUserRoutes from './User/crate.routes';

import userAuth from '../middlewares/user.auth';

const router = express.Router();

router.use('/', credUserRoutes);
router.use('/profile', userAuth, profileUserRoutes);
router.use('/crates', crateUserRoutes);

export default router;

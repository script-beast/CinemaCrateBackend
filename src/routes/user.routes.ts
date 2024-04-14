import express from 'express';

import credUserRoutes from './User/cred.routes';
import profileRoutes from './User/profile.routes';

import userAuth from '../middlewares/user.auth';

const router = express.Router();

router.use('/', credUserRoutes);
router.use('/profile', userAuth, profileRoutes);

export default router;

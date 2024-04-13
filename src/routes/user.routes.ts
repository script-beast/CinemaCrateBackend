import express from 'express';

import credUserRoutes from './User/cred.routes';

const router = express.Router();

router.use('/', credUserRoutes);

export default router;

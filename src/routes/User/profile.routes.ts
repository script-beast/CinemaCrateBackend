import express from 'express';

import profileController from '../../controllers/User/profile.controller';

const router = express.Router();

router.get('/short', profileController.getProfileShort);

export default router;

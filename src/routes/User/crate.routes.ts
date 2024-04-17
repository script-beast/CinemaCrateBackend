import express from 'express';

import CrateController from '../../controllers/User/crate.controller';

import userAuth from '../../middlewares/user.auth';

const router = express.Router();

router.get('/', CrateController.allActiveCrates);
router.get('/:id', userAuth, CrateController.crateById);

export default router;

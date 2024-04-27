import express from 'express';

import premiumCrateController from '../../controllers/User/premiumCrate.controller';

import userAuth from '../../middlewares/user.auth';

const router = express.Router();

router.get('/', premiumCrateController.allActivepremiumCrates);
router.get('/:id', userAuth, premiumCrateController.premiumCrateById);

export default router;

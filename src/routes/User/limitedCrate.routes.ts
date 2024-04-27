import express from 'express';

import limitedCrateController from '../../controllers/User/limitedCrate.controller';

import userAuth from '../../middlewares/user.auth';

const router = express.Router();

router.get('/', limitedCrateController.allActiveLimitedCrates);
router.get('/:id', userAuth, limitedCrateController.limitedCrateById);
router.get(
  '/buyWallet/:id',
  userAuth,
  limitedCrateController.buyLimitedCrateWallet,
);
router.get(
  '/createStripeIntent/:id',
  userAuth,
  limitedCrateController.createLimitedCratePaymentIntent,
);

export default router;

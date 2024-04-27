import express from 'express';

import crateController from '../../controllers/User/crate.controller';

import userAuth from '../../middlewares/user.auth';

const router = express.Router();

router.get('/', crateController.allActiveCrates);
router.get('/:id', userAuth, crateController.crateById);
router.get('/buyWallet/:id', userAuth, crateController.buyCrateWallet);
router.get(
  '/createStripeIntent/:id',
  userAuth,
  crateController.createCrateStripePaymentIntent,
);
export default router;

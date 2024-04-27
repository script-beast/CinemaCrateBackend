import express from 'express';

import storeController from '../../controllers/User/store.controller';

const router = express.Router();

router.get('/', storeController.allActiveStores);
router.get('/:id', storeController.storeById);
router.get('/createStripeIntent/:id', storeController.createStorePaymentIntent);

export default router;

import express from 'express';

import profileController from '../../controllers/User/profile.controller';

const router = express.Router();

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.put('/address', profileController.updateAddress);
router.get('/short', profileController.getProfileShort);
router.get('/crates', profileController.getMyCrates);
router.get('/orders', profileController.getMyOrders);
router.get('/recuringOrders', profileController.getMyRecuringOrders);
router.get('/referredUsers', profileController.getReferredUsers);

export default router;

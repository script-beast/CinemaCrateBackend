import express from 'express';

import profileController from '../../controllers/User/profile.controller';

import validate from '../../middlewares/validation.zod';

import UpdateProfileSchema from '../../validations/User/profile/updateProfile.zod';
import UpdateAddressSchema from '../../validations/User/profile/updateAdress.zod';

const router = express.Router();

router.get('/', profileController.getProfile);
router.put('/', validate(UpdateProfileSchema), profileController.updateProfile);
router.put(
  '/address',
  validate(UpdateAddressSchema),
  profileController.updateAddress,
);
router.get('/short', profileController.getProfileShort);
router.get('/crates', profileController.getMyCrates);
router.get('/orders', profileController.getMyOrders);
router.get('/recuringOrders', profileController.getMyRecuringOrders);
router.get('/referredUsers', profileController.getReferredUsers);

export default router;

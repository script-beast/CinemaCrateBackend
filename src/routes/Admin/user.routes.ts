import express from 'express';

import userController from '../../controllers/Admin/user.controller';

import validate from '../../middlewares/validation.zod';

import updateStatusSchema from '../../validations/Admin/user/updateStatus.zod';
import updateWalletSchema from '../../validations/Admin/user/updateWallet.zod';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.put(
  '/wallet/:id',
  validate(updateWalletSchema),
  userController.updateWallet,
);
router.put(
  '/status/:id',
  validate(updateStatusSchema),
  userController.updateStatus,
);

router.get('/:id', userController.getUserDataById);
export default router;

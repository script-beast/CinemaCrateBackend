import express from 'express';

import userController from '../../controllers/Admin/user.controller';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserDataById);
router.put('/wallet/:id', userController.updateUserWallet);
router.put('/status/:id', userController.updateUserStatus);

export default router;

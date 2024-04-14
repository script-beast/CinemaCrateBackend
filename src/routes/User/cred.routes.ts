import express from 'express';

import credController from '../../controllers/User/cred.controller';

import validate from '../../middlewares/validation.zod';

import registerSchema from '../../validations/User/cred/register.zod';
import loginSchema from '../../validations/User/cred/login.zod';
import generateVerificationOTPSchema from '../../validations/User/cred/generateVerificationOTP.zod';
import verifyOTPSchema from '../../validations/User/cred/verifyOTP.zod';
import generateResetPassOTPSchema from '../../validations/User/cred/generateResetPassOTP.zod';
import resetPasswordSchema from '../../validations/User/cred/resetPassword.zod';
import refreshTokenSchema from '../../validations/User/cred/refreshToken.zod';

const router = express.Router();

router.post('/register', validate(registerSchema), credController.register);
router.post('/login', validate(loginSchema), credController.login);
router.post(
  '/generateVerificationOTP',
  validate(generateVerificationOTPSchema),
  credController.generateVerificationOTP,
);
router.post('/verifyOTP', validate(verifyOTPSchema), credController.verifyOTP);
router.post(
  '/generateResetPassOTP',
  validate(generateResetPassOTPSchema),
  credController.generateResetPassOTP,
);
router.post(
  '/resetPassword',
  validate(resetPasswordSchema),
  credController.resetPassword,
);
router.post(
  '/refreshToken',
  validate(refreshTokenSchema),
  credController.refreshToken,
);

export default router;

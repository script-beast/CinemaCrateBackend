import express from 'express';
import credController from '../../controllers/Admin/cred.controller';

import validate from '../../middlewares/validation.zod';

import registerSchema from '../../validations/Admin/cred/register.zod';
import loginSchema from '../../validations/Admin/cred/login.zod';

const router = express.Router();

router.post('/register', validate(registerSchema), credController.register);
router.post('/login', validate(loginSchema), credController.login);

export default router;

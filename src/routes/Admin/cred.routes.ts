import express from 'express';
import credController from '../../controllers/Admin/cred.controller';

import validate from '../../middlewares/validation.zod';

import registerSchema from '../../validations/Admin/cred/register.zod';
import loginSchema from '../../validations/Admin/cred/login.zod';

const router = express.Router();

const credControllerIns = new credController();

router.post('/register', validate(registerSchema), credControllerIns.register);
router.post('/login', validate(loginSchema), credControllerIns.login);

export default router;

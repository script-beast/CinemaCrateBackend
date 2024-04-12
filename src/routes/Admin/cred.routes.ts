import express from 'express';
import credController from '../../controllers/Admin/cred.controller';

const router = express.Router();

const credControllerIns = new credController();

router.post('/register', credControllerIns.register);
router.post('/login', credControllerIns.login);

export default router;

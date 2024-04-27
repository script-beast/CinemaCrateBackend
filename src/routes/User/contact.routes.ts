import express from 'express';

import contactController from '../../controllers/User/contact.controller';

import validate from '../../middlewares/validation.zod';

import createContactSchema from '../../validations/User/contact/createContact.zod';

const router = express.Router();

router.post(
  '/',
  validate(createContactSchema),
  contactController.createContact,
);

export default router;

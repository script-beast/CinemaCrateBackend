import express from 'express';

import contactController from '../../controllers/Admin/contact.controller';

import validate from '../../middlewares/validation.zod';

import replyContactSchema from '../../validations/Admin/contact/replyContact.zod';

const router = express.Router();

router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getSingleContact);
router.put(
  '/:id',
  validate(replyContactSchema),
  contactController.replyContact,
);

export default router;

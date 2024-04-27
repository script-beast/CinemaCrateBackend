import express from 'express';
import limitedCrateController from '../../controllers/Admin/limitedCrate.controller';

import validate from '../../middlewares/validation.zod';

import reqLimitedCrateSchema from '../../validations/Admin/limitedCrate/reqLimitedCrate.zod';

const router = express.Router();

router.get('/', limitedCrateController.getAllLimitedCrates);
router.post(
  '/',
  validate(reqLimitedCrateSchema),
  limitedCrateController.createLimitedCrate,
);
router.get('/deleted', limitedCrateController.getDeletedLimitedCrates);
router.get('/past', limitedCrateController.getPastLimitedCrates);

router.patch('/restore/:id', limitedCrateController.restoreLimitedCrate);

router.get('/:id', limitedCrateController.getSingleLimitedCrate);
router.put(
  '/:id',
  validate(reqLimitedCrateSchema),
  limitedCrateController.updateLimitedCrate,
);
router.delete('/:id', limitedCrateController.deleteLimitedCrate);

export default router;

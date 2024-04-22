import express from 'express';
import premiumCrateController from '../../controllers/Admin/premiumCrate.controller';

import validate from '../../middlewares/validation.zod';

import ReqPremiumCrateSchema from '../../validations/Admin/premiumCrate/reqPremiumCrate.zod';

const router = express.Router();

router.get('/', premiumCrateController.getAllPremiumCrates);
router.post('/', validate(ReqPremiumCrateSchema),  premiumCrateController.createPremiumCrate,);
router.get('/deleted', premiumCrateController.getDeletedPremiumCrates);
router.patch('/restore/:id', premiumCrateController.restorePremiumCrate);
router.get('/:id', premiumCrateController.getSinglePremiumCrate);
router.put('/:id',  validate(ReqPremiumCrateSchema),  premiumCrateController.updatePremiumCrate,);
router.delete('/:id', premiumCrateController.deletePremiumCrate);

export default router;
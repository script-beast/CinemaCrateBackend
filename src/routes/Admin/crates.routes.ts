import express from 'express';

import crateController from '../../controllers/Admin/crate.controller';

import validate from '../../middlewares/validation.zod';

import reqCrateSchema from '../../validations/Admin/crate/reqCrate.zod';
import giftCrateSchema from '../../validations/Admin/crate/giftCrate.zod';

const router = express.Router();

router.get('/', crateController.getAllCrates);
router.post('/', validate(reqCrateSchema), crateController.createCrate);
router.get('/deleted', crateController.getDeletedCrates);

router.post('/gift/:id', validate(giftCrateSchema), crateController.giftCrate);
router.patch('/restore/:id', crateController.restoreCrate);

router.get('/:id', crateController.getSingleCrate);
router.put('/:id', validate(reqCrateSchema), crateController.updateCrate);
router.delete('/:id', crateController.deleteCrate);

export default router;

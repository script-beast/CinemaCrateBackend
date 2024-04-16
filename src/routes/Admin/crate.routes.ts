import express from 'express';

import crateController from '../../controllers/Admin/crate.controller';

import validate from '../../middlewares/validation.zod';

import reqCrateSchema from '../../validations/Admin/crate/reqCrate.zod';
import giftCrateSchema from '../../validations/Admin/crate/giftCrate.zod';

const router = express.Router();

router.get('/', crateController.getAllCrates);
router.get('/category/:category', crateController.getCratesByCategory);
router.get('/genre/:genre', crateController.getCratesByGenre);
router.get('/cast/:cast', crateController.getCratesByCast);
router.get('/:id', crateController.getSingleCrate);
router.get('/deleted', crateController.getDeletedCrates);

router.post('/', validate(reqCrateSchema), crateController.createCrate);
router.post('/gift', validate(giftCrateSchema), crateController.giftCrate);

router.put('/:id', validate(reqCrateSchema), crateController.updateCrate);
router.put('/restore/:id', crateController.restoreCrate);

router.delete('/:id', crateController.deleteCrate);

export default router;

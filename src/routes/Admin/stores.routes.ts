import express from 'express';
import StoreController from '../../controllers/Admin/store.controller';

import validate from '../../middlewares/validation.zod';

import ReqStoreSchema from '../../validations/Admin/store/reqStore.zod';

const router = express.Router();

router.get('/', StoreController.getAllStores);
router.post('/', validate(ReqStoreSchema), StoreController.createStore);
router.get('/deleted', StoreController.getDeletedStores);
router.patch('/restore/:id', StoreController.restoreStore);

router.get('/:id', StoreController.getSingleStore);
router.put('/:id', validate(ReqStoreSchema), StoreController.updateStore);
router.delete('/:id', StoreController.deleteStore);

export default router;

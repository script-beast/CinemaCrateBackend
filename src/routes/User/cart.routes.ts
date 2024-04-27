import express from 'express';

import cartController from '../../controllers/User/cart.controller';

const router = express.Router();

router.get('/', cartController.getCart);
router.delete('/', cartController.clearCart);

router.post('/:id', cartController.addToCart);
router.delete('/:id', cartController.removeFromCart);

export default router;

import express from 'express';
import OrderController from '../../controllers/Admin/order.controller';

const router = express.Router();

router.get('/', OrderController.getAllOrders);
router.get('/user/:id', OrderController.getOrderByUser);
router.get('/:id', OrderController.getOrderById);

export default router;

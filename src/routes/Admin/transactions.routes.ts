import express from 'express';
import transactionController from '../../controllers/Admin/transaction.controller';

const router = express.Router();

router.get('/', transactionController.getAllTransactions);
router.get('/user/:id', transactionController.getTransactionByUser);
router.get('/:id', transactionController.getTransactionById);

export default router;

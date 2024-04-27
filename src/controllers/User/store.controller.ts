import mongoose from 'mongoose';
import { Response, Request } from 'express';

import storeModel from '../../models/store.model';
import orderHistoryModel from '../../models/orderHistory.model';
import transactionModel from '../../models/transaction.model';
import userDataModel from '../../models/userData.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';

import ExpressResponse from '../../libs/express/response.libs';

import {
  paymentGateway,
  paymentType,
  product,
  transactionStatus,
} from '../../interfaces/common/payment.enum';

class StoreController {
  public allActiveStores = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await storeModel
      .find({ isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(
      (await storeModel.countDocuments({ isDeleted: false })) / limit,
    );

    return ExpressResponse.success(res, 'Success', { result, totalPages });
  });

  public storeById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const result = await storeModel.findById(id).select('-isDeleted');

    if (!result) {
      return ExpressResponse.notFound(res, 'Store not found');
    }

    ExpressResponse.success(res, 'Success', { result });
  });

  public createStorePaymentIntent = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const { userId } = req;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      const store = await storeModel.findById(id);

      if (!store) {
        return ExpressResponse.notFound(res, 'Store not found');
      }

      const userData = await userDataModel.findOne({ userId });

      if (!userData) {
        return ExpressResponse.notFound(res, 'User not found');
      }

      const transaction = await transactionModel.create({
        userId,
        storeId: store._id,
        gateway: paymentGateway.STRIPE,
        price: store.price,
        product: product.STORE,
        paymentId: 'stripe_payment_id',
      });

      transaction.save();

      userData.transaction.push(transaction._id);

      await userData.save();

      ExpressResponse.success(res, 'Payment intent created', {
        result: {
          client_secret: 'client_secret',
          payment_intent_id: 'payment_intent_id',
        },
      });
    },
  );

  // public validateStorePayment = catchAsync(
}

export default new StoreController();

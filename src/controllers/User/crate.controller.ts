import mongoose from 'mongoose';
import { Response, Request } from 'express';

import crateModel from '../../models/crate.model';
import orderHistoryModel from '../../models/orderHistory.model';
import transactionModel from '../../models/transaction.model';
import userDataModel from '../../models/userData.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';

import ExpressResponse from '../../libs/express/response.libs';

import {
  paymentMethod,
  paymentGateway,
  paymentType,
  product,
} from '../../interfaces/common/payment.enum';

class CrateController {
  public allActiveCrates = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    let options = {};

    if (req.query.category) {
      options = { ...options, category: req.query.category };
    }

    if (req.query.genre) {
      options = { ...options, genre: req.query.genre };
    }

    if (req.query.cast) {
      options = { ...options, casts: { $in: [req.query.cast] } };
    }

    const totalPages = Math.ceil(
      (await crateModel.countDocuments({ ...options, isDeleted: false })) /
        limit,
    );

    const result = await crateModel
      .find({ ...options, isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit);

    return ExpressResponse.success(res, 'Success', { result, totalPages });
  });

  public crateById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const result = await crateModel.findById(id).select('-isDeleted -links');

    if (!result) {
      return ExpressResponse.notFound(res, 'Crate not found');
    }

    ExpressResponse.success(res, 'Success', { result });
  });

  public buyCrateWallet = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const crate = await crateModel.findById(id);

    if (!crate) {
      return ExpressResponse.notFound(res, 'Crate not found');
    }

    const user = await userDataModel.findOne({ userId });

    if (!user) {
      return ExpressResponse.notFound(res, 'User not found');
    }

    const crateId = new mongoose.Types.ObjectId(id);

    // if order already exists with wallet

    const extistingOrder = await orderHistoryModel.findOne({
      userId,
      crateId,
      method: paymentMethod.WALLET,
    });

    if (extistingOrder) {
      return ExpressResponse.badRequest(
        res,
        'You already have this crate with wallet',
      );
    }

    if (user.wallet < crate.price) {
      return ExpressResponse.badRequest(res, 'Insufficient funds');
    }

    user.wallet -= crate.price;

    if (!user.crate.includes(crateId)) {
      user.crate.push(crateId);
    }

    const orderHistory = new orderHistoryModel({
      userId,
      crateId,
      gateway: paymentGateway.WALLET,
      desc: `Bought ${crate.name} with wallet`,
      price: crate.price,
      method: paymentMethod.WALLET,
      type: paymentType.DEBIT,
      product: product.CRATE,
    });

    orderHistory.save();

    user.orderHistory.push(orderHistory._id);

    await user.save();

    ExpressResponse.accepted(res, 'Crate bought successfully');
  });

  public createCratePaymentIntentStripe = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const userId = req.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      const crate = await crateModel.findById(id);

      if (!crate) {
        return ExpressResponse.notFound(res, 'Crate not found');
      }

      const user = await userDataModel.findOne({ userId });

      if (!user) {
        return ExpressResponse.notFound(res, 'User not found');
      }

      const crateId = new mongoose.Types.ObjectId(id);

      const extistingOrder = await orderHistoryModel.findOne({
        userId,
        crateId,
        method: 'Stripe',
      });

      if (extistingOrder) {
        return ExpressResponse.badRequest(
          res,
          'You already have this crate with stripe',
        );
      }

      // create payment intent for stripe

      const transaction = new transactionModel({
        userId,
        crateId,
        gateway: 'stripe',
        price: crate.price,
        paymentId: 'stripe_payment_id',
        product: 'crate',
      });

      transaction.save();

      user.transaction.push(transaction._id);

      await user.save();

      ExpressResponse.success(res, 'Payment intent created', {
        result: {
          client_secret: 'client_secret',
          payment_intent_id: 'payment_intent_id',
        },
      });
    },
  );
}

export default new CrateController();

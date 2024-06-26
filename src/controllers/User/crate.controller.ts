import mongoose from 'mongoose';
import { Response, Request } from 'express';

import crateModel from '../../models/crate.model';
import orderHistoryModel from '../../models/orderHistory.model';
import transactionModel from '../../models/transaction.model';
import userDataModel from '../../models/userData.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';

import ExpressResponse from '../../libs/express/response.libs';

import redisConnection from '../../connections/redis.connection';

import {
  paymentGateway,
  paymentType,
  product,
} from '../../interfaces/common/payment.enum';

class CrateController {
  public allActiveCrates = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    let options = {};
    let key = ['crates', String(page), String(limit), '', '', ''];

    if (req.query.category) {
      options = { ...options, category: req.query.category };
      key[3] = String(req.query.category);
    }

    if (req.query.genre) {
      options = { ...options, genre: req.query.genre };
      key[4] = String(req.query.genre);
    }

    if (req.query.cast) {
      options = { ...options, casts: { $in: [req.query.cast] } };
      key[5] = String(req.query.cast);
    }

    const cache = await redisConnection.get(key.join(':'));

    if (cache) {
      const { result, totalPages } = JSON.parse(cache);
      return ExpressResponse.success(res, 'Success', { result, totalPages });
    }

    const totalPages = Math.ceil(
      (await crateModel.countDocuments({ ...options, isDeleted: false })) /
        limit,
    );

    const result = await crateModel
      .find({ ...options, isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit);

    redisConnection.setex(
      key.join(':'),
      // 3600, // for 1 hour
      900, // for 15 minutes
      JSON.stringify({ result, totalPages }),
    );

    console.log('Cache miss');

    return ExpressResponse.success(res, 'Success', { result, totalPages });
  });

  public crateById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const cache = await redisConnection.get(`crates:${id}`);

    if (cache) {
      const result = JSON.parse(cache);
      return ExpressResponse.success(res, 'Success', { result });
    }

    const result = await crateModel.findById(id).select('-isDeleted -links');

    if (!result) {
      return ExpressResponse.notFound(res, 'Crate not found');
    }

    redisConnection.setex(`crates:${id}`, 900, JSON.stringify(result));

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
      gateway: paymentGateway.WALLET,
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

    const orderHistory = await orderHistoryModel.create({
      userId,
      crateId,
      gateway: paymentGateway.WALLET,
      price: crate.price,
      type: paymentType.DEBIT,
      product: product.CRATE,
    });

    await orderHistory.save();

    user.orderHistory.push(orderHistory._id);

    await user.save();

    ExpressResponse.accepted(res, 'Crate bought successfully');
  });

  public createCrateStripePaymentIntent = catchAsync(
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
        gateway: paymentGateway.STRIPE,
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
        gateway: paymentGateway.STRIPE,
        price: crate.price,
        paymentId: 'stripe_payment_id',
        product: product.CRATE,
      });

      await transaction.save();

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

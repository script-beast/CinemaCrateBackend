import mongoose from 'mongoose';
import { Response, Request } from 'express';

import userDataModel from '../../models/userData.model';
import limitedCrateModel from '../../models/limitedCrate.model';
import orderHistoryModel from '../../models/orderHistory.model';
import transactionModel from '../../models/transaction.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';

import ExpressResponse from '../../libs/express/response.libs';

class LimitedCrateController {
  public allActiveLimitedCrates = catchAsync(
    async (req: Request, res: Response) => {
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

      if (req.query.occassion) {
        options = { ...options, occassion: req.query.occassion };
      }

      const result = await limitedCrateModel
        .find({ ...options, isDeleted: false, endTime: { $gte: new Date() } })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalPages = Math.ceil(
        (await limitedCrateModel.countDocuments({
          ...options,
          isDeleted: false,
          endTime: { $gte: new Date() },
        })) / limit,
      );

      return ExpressResponse.success(res, 'Success', {
        result,
        totalPages,
      });
    },
  );

  public limitedCrateById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const result = await limitedCrateModel
      .findById(id)
      .select('-isDeleted -links');

    if (!result) {
      return ExpressResponse.notFound(res, 'Limited Crate not found');
    }

    ExpressResponse.success(res, 'Success', { result });
  });

  public buyLimitedCrateWallet = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const userId = req.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      const limitedCrate = await limitedCrateModel.findById(id);

      if (!limitedCrate) {
        return ExpressResponse.notFound(res, 'Limited Crate not found');
      }

      const user = await userDataModel.findById(userId);

      if (!user) {
        return ExpressResponse.notFound(res, 'User not found');
      }

      const extistingOrder = await orderHistoryModel.findOne({
        userId,
        crateId: limitedCrate._id,
        method: 'Wallet',
      });

      if (extistingOrder) {
        return ExpressResponse.badRequest(
          res,
          'You already have this limited crate with wallet',
        );
      }

      if (user.wallet < limitedCrate.discountPrice) {
        return ExpressResponse.badRequest(res, 'Insufficient Wallet Balance');
      }

      user.wallet -= limitedCrate.discountPrice;

      if (!user.limitedCrate.includes(limitedCrate._id)) {
        user.limitedCrate.push(limitedCrate._id);
      }

      const orderHistory = new orderHistoryModel({
        userId,
        limitedCrateId: limitedCrate._id,
        gateway: 'Wallet',
        desc: `Bought ${limitedCrate.name} with wallet`,
        price: limitedCrate.discountPrice,
        method: 'Wallet',
        type: 'debit',
        product: 'limitedCrate',
      });

      await orderHistory.save();

      user.orderHistory.push(orderHistory._id);

      await user.save();

      ExpressResponse.accepted(res, 'Limited Crate bought successfully');
    },
  );

  public createLimitedCratePaymentIntent = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const userId = req.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      const limitedCrate = await limitedCrateModel.findById(id);

      if (!limitedCrate) {
        return ExpressResponse.notFound(res, 'Limited Crate not found');
      }

      const user = await userDataModel.findById(userId);

      if (!user) {
        return ExpressResponse.notFound(res, 'User not found');
      }

      const extistingOrder = await orderHistoryModel.findOne({
        userId,
        limitedCrateId: limitedCrate._id,
        method: 'Stripe',
      });

      if (extistingOrder) {
        return ExpressResponse.badRequest(
          res,
          'You already have this limited crate with stripe',
        );
      }

      const transaction = new transactionModel({
        userId,
        limitedCrateId: limitedCrate._id,
        price: limitedCrate.discountPrice,
        gateway: 'Stripe',
        type: 'debit',
        paymentId: 'stripe_payment_id',
        status: 'pending',
        product: 'limitedCrate',
      });

      await transaction.save();

      user.transaction.push(transaction._id);

      await user.save();

      ExpressResponse.success(res, 'Payment intent created successfully', {
        result: {
          client_secret: 'client_secret',
          payment_intent_id: 'payment_intent_id',
        },
      });
    },
  );
}

export default new LimitedCrateController();
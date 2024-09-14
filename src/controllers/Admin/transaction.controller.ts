import { Request, Response } from 'express';
import mongoose from 'mongoose';

import transactionModel from '../../models/transaction.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

class Transaction {
  public getAllTransactions = catchAsync(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      let options = {};

      if (req.query.product) {
        options = { ...options, userId: req.query.product };
      }

      if (req.query.status) {
        options = { ...options, status: req.query.status };
      }

      if (req.query.gateway) {
        options = { ...options, gateway: req.query.gateway };
      }

      const result = await transactionModel.aggregate([
        {
          $match: options,
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'userData',
          },
        },
        {
          $lookup: {
            from: 'store',
            localField: 'storeId',
            foreignField: '_id',
            as: 'store',
          },
        },
        {
          $lookup: {
            from: 'crate',
            localField: 'crateId',
            foreignField: '_id',
            as: 'crate',
          },
        },
        {
          $lookup: {
            from: 'limitedCrate',
            localField: 'limitedCrateId',
            foreignField: '_id',
            as: 'limitedCrate',
          },
        },
        {
          $project: {
            userName: '$userData.name',
            userEmail: '$userData.email',
            itemName: {
              $cond: {
                if: { $eq: ['$product', 'store'] },
                then: '$store.name',
                else: {
                  $cond: {
                    if: { $eq: ['$product', 'crate'] },
                    then: '$crate.name',
                    else: '$limitedCrate.name',
                  },
                },
              },
            },
            product: {
              $cond: {
                if: { $eq: ['$product', 'store'] },
                then: 'Store',
                else: {
                  $cond: {
                    if: { $eq: ['$product', 'crate'] },
                    then: 'Crate',
                    else: 'Limited Crate',
                  },
                },
              },
            },
            gateway: 1,
            price: 1,
            status: 1,
            paymentId: 1,
            _id: 1,
          },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      ]);

      const total = await transactionModel.countDocuments(options);

      return ExpressResponse.success(res, 'Success', {
        result,
        total,
      });
    },
  );

  public getTransactionById = catchAsync(
    async (req: Request, res: Response) => {
      const id: string = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid transaction id');
      }

      const result = await transactionModel
        .findById(id)
        .populate('userId storeId crateId limitedCrateId');

      if (!result) {
        return ExpressResponse.notFound(res, 'Transaction not found');
      }

      return ExpressResponse.success(res, 'Success', { result });
    },
  );

  public getTransactionByUser = catchAsync(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const userId: string = req.params.userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return ExpressResponse.badRequest(res, 'Invalid user id');
      }

      const result = await transactionModel
        .find({ userId })
        .populate('userId storeId crateId limitedCrateId')
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await transactionModel.countDocuments({ userId });

      return ExpressResponse.success(res, 'Success', {
        result,
        total,
      });
    },
  );
}

export default new Transaction();

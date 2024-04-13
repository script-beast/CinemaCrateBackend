import { Request, Response } from 'express';
import mongoose from 'mongoose';

import userDataModel from '../../models/userData.model';
import userModel from '../../models/user.model';
import transactionModel from 'models/transaction.model';

import catchAsync from '../../utils/ErrorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

class Transaction {
  public getTransactions = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // I want to populate the userId, storeId, crateId, limitedCrateId fields in the transaction model
    // and get something like this:
    // { UserName : 'John Doe', itemName: 'Store 1', product:"store", gateway:"stripe", price: 100, status: "success", paymentId: "1234" }
    // { UserName : 'John Doe', itemName: 'Crate 1', product:"crate", gateway:"phonepe", price: 200, status: "pending", paymentId: "1234" }
    // use aggregate to get the above result

    const transactions = await transactionModel.aggregate([
      {
        $lookup: {
          from: 'userData',
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

    return ExpressResponse.success(res, 'Success', { transactions });
  });

  public getTransactionById = catchAsync(
    async (req: Request, res: Response) => {
      const id: string = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid transaction id');
      }

      const transaction = await transactionModel
        .findById(id)
        .populate('userId storeId crateId limitedCrateId');

      if (!transaction) {
        return ExpressResponse.notFound(res, 'Transaction not found');
      }

      return ExpressResponse.success(res, 'Success', { transaction });
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

      const transactions = await transactionModel
        .find({ userId })
        .populate('userId storeId crateId limitedCrateId')
        .skip((page - 1) * limit)
        .limit(limit);

      return ExpressResponse.success(res, 'Success', { transactions });
    },
  );

  public getTransactionByStore = catchAsync(
    async (req: Request, res: Response) => {
      const storeId: string = req.params.storeId;
      if (!mongoose.Types.ObjectId.isValid(storeId)) {
        return ExpressResponse.badRequest(res, 'Invalid store id');
      }

      const transactions = await transactionModel
        .find({ storeId })
        .populate('userId storeId');

      return ExpressResponse.success(res, 'Success', { transactions });
    },
  );

  public getTransactionByCrate = catchAsync(
    async (req: Request, res: Response) => {
      const crateId: string = req.params.crateId;
      if (!mongoose.Types.ObjectId.isValid(crateId)) {
        return ExpressResponse.badRequest(res, 'Invalid crate id');
      }

      const transactions = await transactionModel
        .find({ crateId })
        .populate('userId crateId');

      return ExpressResponse.success(res, 'Success', { transactions });
    },
  );

  public getTransactionByLimitedCrate = catchAsync(
    async (req: Request, res: Response) => {
      const limitedCrateId: string = req.params.limitedCrateId;
      if (!mongoose.Types.ObjectId.isValid(limitedCrateId)) {
        return ExpressResponse.badRequest(res, 'Invalid limited crate id');
      }

      const transactions = await transactionModel
        .find({ limitedCrateId })
        .populate('userId limitedCrateId');

      return ExpressResponse.success(res, 'Success', { transactions });
    },
  );
}

export default Transaction;

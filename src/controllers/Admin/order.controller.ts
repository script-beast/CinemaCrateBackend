import { Request, Response } from 'express';
import mongoose from 'mongoose';

import orderHistoryModel from '../../models/orderHistory.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

class OrderController {
  public getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    let options = {};

    if (req.query.product) {
      options = { ...options, product: req.query.product };
    }

    if (req.query.gateway) {
      options = { ...options, gateway: req.query.gateway };
    }

    if (req.query.method) {
      options = { ...options, method: req.query.method };
    }
    // order is connected to userData and userData to user so we need to unwind it twice to get the user name and email

    if (req.query.type) {
      options = { ...options, type: req.query.type };
    }

    const result = await orderHistoryModel.aggregate([
      {
        $match: options,
      },
      {
        $lookup: {
          from: 'userdatas',
          localField: 'userId',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $unwind: '$userData',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userData.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          product: 1,
          gateway: 1,
          method: 1,
          type: 1,
          price: 1,
          status: 1,
          userName: '$user.name',
          userEmail: '$user.email',
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);

    const totalPages = Math.ceil(
      (await orderHistoryModel.countDocuments(options)) / limit,
    );

    ExpressResponse.success(res, 'Success', { result, totalPages });
  });

  public getOrderById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid order id');
    }

    const result = await orderHistoryModel
      .findById(id)
      .populate('userId storeId crateId limitedCrateId');

    if (!result) {
      return ExpressResponse.notFound(res, 'Order not found');
    }

    ExpressResponse.success(res, 'Success', { result });
  });

  public getOrderByUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid user id');
    }

    const result = await orderHistoryModel.aggregate([
      {
        $lookup: {
          from: 'userdatas',
          localField: 'userId',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $unwind: '$userData',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userData.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $match: { "user._id": new mongoose.Types.ObjectId(id) },
      },
      {
        $project: {
          _id: 1,
          product: 1,
          gateway: 1,
          method: 1,
          type: 1,
          price: 1,
          status: 1,
          userName: '$user.name',
          userEmail: '$user.email',
        },
      },
    ]);

    ExpressResponse.success(res, 'Success', { result });
  });
}

export default new OrderController();

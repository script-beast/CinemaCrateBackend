import { Request, Response } from 'express';
import mongoose from 'mongoose';

import orderHistoryModel from '../../models/orderHistory.model';

import catchAsync from '../../utils/ErrorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

class OrderController {
  public getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const orders = await orderHistoryModel.aggregate([
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
          desc: 1,
          method: 1,
          type: 1,
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

    ExpressResponse.success(res, 'Success', { orders });
  });

  public getOrderById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid order id');
    }

    const order = await orderHistoryModel
      .findById(id)
      .populate('userId storeId crateId limitedCrateId');

    if (!order) {
      return ExpressResponse.notFound(res, 'Order not found');
    }

    ExpressResponse.success(res, 'Success', { order });
  });

  public getOrderByUser = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return ExpressResponse.badRequest(res, 'Invalid user id');
    }

    const orders = await orderHistoryModel
      .find({ userId })
      .populate('userId storeId crateId limitedCrateId');

    ExpressResponse.success(res, 'Success', { orders });
  });

  public getOrderByProduct = catchAsync(async (req: Request, res: Response) => {
    const { product } = req.params;

    const orders = await orderHistoryModel
      .find({ product })
      .populate('userId storeId crateId limitedCrateId');

    ExpressResponse.success(res, 'Success', { orders });
  });

  public getOrderByStatus = catchAsync(async (req: Request, res: Response) => {
    const { status } = req.params;

    const orders = await orderHistoryModel
      .find({ status })
      .populate('userId storeId crateId limitedCrateId');

    ExpressResponse.success(res, 'Success', { orders });
  });

  public getOrderByGateway = catchAsync(async (req: Request, res: Response) => {
    const { gateway } = req.params;

    const orders = await orderHistoryModel
      .find({ gateway })
      .populate('userId storeId crateId limitedCrateId');

    ExpressResponse.success(res, 'Success', { orders });
  });

  public getOrderByMethod = catchAsync(async (req: Request, res: Response) => {
    const { method } = req.params;

    const orders = await orderHistoryModel
      .find({ method })
      .populate('userId storeId crateId limitedCrateId');

    ExpressResponse.success(res, 'Success', { orders });
  });

  public getOrderByType = catchAsync(async (req: Request, res: Response) => {
    const { type } = req.params;

    const orders = await orderHistoryModel
      .find({ type })
      .populate('userId storeId crateId limitedCrateId');

    ExpressResponse.success(res, 'Success', { orders });
  });
}

export default new OrderController();

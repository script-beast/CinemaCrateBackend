import { Request, Response } from 'express';
import mongoose from 'mongoose';

import crateModel from '../../models/crate.model';
import userDataModel from '../../models/userData.model';
import orderHistoryModel from '../../models/orderHistory.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

import { ReqCrateSchemaType } from '../../validations/Admin/crate/reqCrate.zod';
import { GiftCrateSchemaType } from '../../validations/Admin/crate/giftCrate.zod';

import {
  paymentGateway,
  product,
  transactionStatus,
} from '../../interfaces/common/payment.enum';

class CrateController {
  public getAllCrates = catchAsync(async (req: Request, res: Response) => {
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

  public getSingleCrate = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const crate = await crateModel.findById(id);

    if (!crate) {
      return ExpressResponse.notFound(res, 'Crate not found');
    }

    const crateOrderHistory = await orderHistoryModel.find({
      crateId: crate._id,
    });

    const result = {
      crate,
      crateOrderHistory,
    };

    return ExpressResponse.success(res, 'Success', { result });
  });

  public createCrate = catchAsync(async (req: Request, res: Response) => {
    const parseDta = req.body as ReqCrateSchemaType;

    await crateModel.create(parseDta);

    return ExpressResponse.created(res, 'Crate created successfully');
  });

  public updateCrate = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const parseDta = req.body as ReqCrateSchemaType;

    const updatedCrate = await crateModel.findByIdAndUpdate(id, parseDta, {
      new: true,
    });

    if (!updatedCrate) {
      return ExpressResponse.notFound(res, 'Crate not found');
    }

    return ExpressResponse.accepted(res, 'Crate updated successfully');
  });

  public deleteCrate = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const deletedCrate = await crateModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    if (!deletedCrate) {
      return ExpressResponse.notFound(res, 'Crate not found');
    }

    return ExpressResponse.accepted(res, 'Crate deleted successfully');
  });

  public getDeletedCrates = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await crateModel
      .find({ isDeleted: true })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(
      (await crateModel.countDocuments({ isDeleted: true })) / limit,
    );

    return ExpressResponse.success(res, 'Success', {
      result,
      totalPages,
    });
  });

  public restoreCrate = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const restoredCrate = await crateModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true },
    );

    if (!restoredCrate) {
      return ExpressResponse.notFound(res, 'Crate not found');
    }

    return ExpressResponse.accepted(res, 'Crate restored successfully');
  });

  public giftCrate = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const crate = await crateModel.findById(id);

    if (!crate) {
      return ExpressResponse.notFound(res, 'Crate not found');
    }

    const { userId } = req.body as GiftCrateSchemaType;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return ExpressResponse.badRequest(res, 'Invalid user ID');
    }

    const user = await userDataModel.findOne({ userId });

    if (!user) {
      return ExpressResponse.notFound(res, 'User not found');
    }

    const giftedCrate = await orderHistoryModel.create({
      userId: user._id,
      crateId: crate._id,
      gateway: paymentGateway.GIFTED,
      price: crate.price,
      type: product.CRATE,
      product: product.CRATE,
    });

    user.crate.push(crate._id);
    user.orderHistory.push(giftedCrate._id);

    await user.save();

    return ExpressResponse.accepted(res, 'Crate gifted successfully');
  });
}

export default new CrateController();

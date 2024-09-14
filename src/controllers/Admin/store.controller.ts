import { Request, Response } from 'express';
import mongoose from 'mongoose';

import storeModel from '../../models/store.model';
import orderHistoryModel from '../../models/orderHistory.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

import { ReqStoreSchemaType } from '../../validations/Admin/store/reqStore.zod';

class StoreController {
  public getAllStores = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await storeModel
      .find({ isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await storeModel.countDocuments({ isDeleted: false });

    return ExpressResponse.success(res, 'Success', { result, total });
  });

  public getSingleStore = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const store = await storeModel.findById(id);

    if (!store) {
      return ExpressResponse.notFound(res, 'Store not found');
    }

    const orderHistory = await orderHistoryModel.find({ storeId: id });

    const result = {
      store,
      orderHistory,
    };

    return ExpressResponse.success(res, 'Success', { result });
  });

  public createStore = catchAsync(async (req: Request, res: Response) => {
    const { name, price, credits } = req.body as ReqStoreSchemaType;

    const store = await storeModel.create({
      name,
      price,
      credits,
    });

    return ExpressResponse.created(res, 'Store created successfully');
  });

  public updateStore = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, price, credits } = req.body as ReqStoreSchemaType;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const store = await storeModel.findByIdAndUpdate(
      id,
      { name, price, credits },
      { new: true },
    );

    if (!store) {
      return ExpressResponse.notFound(res, 'Store not found');
    }

    return ExpressResponse.accepted(res, 'Store updated successfully');
  });

  public deleteStore = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    await storeModel.findByIdAndUpdate(id, { isDeleted: true });

    return ExpressResponse.accepted(res, 'Store deleted successfully');
  });

  public getDeletedStores = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await storeModel
      .find({ isDeleted: true })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await storeModel.countDocuments({ isDeleted: true });

    return ExpressResponse.success(res, 'Success', { result, total });
  });

  public restoreStore = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    await storeModel.findByIdAndUpdate(id, { isDeleted: false });

    return ExpressResponse.accepted(res, 'Store restored successfully');
  });
}

export default new StoreController();

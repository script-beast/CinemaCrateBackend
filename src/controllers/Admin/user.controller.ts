import { Request, Response } from 'express';
import mongoose from 'mongoose';

import userModel from '../../models/user.model';
import userDataModel from '../../models/userData.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

import { UpdateStatusSchemaType } from '../../validations/Admin/user/updateStatus.zod';
import { UpdateWalletSchemaType } from '../../validations/Admin/user/updateWallet.zod';

class UserController {
  public getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    let options = {};

    if (req.query.name) {
      options = { ...options, name: req.query.name };
    }

    if (req.query.email) {
      options = { ...options, email: req.query.email };
    }

    if (req.query.mobile) {
      options = { ...options, mobile: req.query.mobile };
    }

    const total = await userModel.countDocuments({});

    const result = await userModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit);

    return ExpressResponse.success(res, 'Success', { result, total });
  });

  public getUserDataById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const userData = await userDataModel.findOne({ userId: id });
    const user = await userModel.findById(id);

    if (!userData) {
      return ExpressResponse.notFound(res, 'User data not found');
    }

    if (!user) {
      return ExpressResponse.notFound(res, 'User not found');
    }

    const result = { ...userData, ...user };

    return ExpressResponse.success(res, 'Success', { result });
  });

  public updateWallet = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { wallet } = req.body as UpdateWalletSchemaType;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const user = await userDataModel.findOne({
      userId: id,
    });

    if (!user) {
      return ExpressResponse.notFound(res, 'User not found');
    }

    user.wallet = wallet;

    await user.save();

    return ExpressResponse.accepted(res, 'Wallet updated successfully');
  });

  public updateStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, remark } = req.body as UpdateStatusSchemaType;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const user = await userModel.findById(id);

    if (!user) {
      return ExpressResponse.notFound(res, 'User not found');
    }

    user.status = status;
    user.remark = remark;

    await user.save();

    return ExpressResponse.accepted(res, 'Status updated successfully');
  });
}

export default new UserController();

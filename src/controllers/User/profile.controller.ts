import mongoose from 'mongoose';

import { Request, Response } from 'express';

import userModel from '../../models/user.model';
import userDataModel from '../../models/userData.model';

import bcryptCommon from '../../libs/bcrypt/common.libs';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';

import ExpressResponse from '../../libs/express/response.libs';

class ProfileController {
  public getProfileShort = catchAsync(async (req: Request, res: Response) => {
    const user = await userModel.findById(req.userId);
    if (!user) return ExpressResponse.notFound(res, 'User not found');
    const userData = await userDataModel.findOne({ userId: user._id });
    if (!userData) return ExpressResponse.notFound(res, 'User data not found');
    let isAddress = false;
    if (
      userData.address &&
      userData.city &&
      userData.state &&
      userData.zipNumber &&
      userData.country
    ) {
      isAddress = true;
    }
    const maxdis = 0;

    return ExpressResponse.success(res, 'Success', {
      _id: user._id,
      wallet: userData.wallet,
      name: user.name,
      isVerified: user.isVerified,
      defaultDiscount: maxdis,
      cart: userData.cart,
      isAddress,
    });
  });
}

export default new ProfileController();

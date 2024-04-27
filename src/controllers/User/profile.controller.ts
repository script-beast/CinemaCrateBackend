import { Request, Response } from 'express';

import userModel from '../../models/user.model';
import userDataModel from '../../models/userData.model';
import orderHistoryModel from '../../models/orderHistory.model';
import recurringPaymentModel from '../../models/recurringPayment.model';

import bcryptCommon from '../../libs/bcrypt/common.libs';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

import { UpdateProfileSchemaType } from '../../validations/User/profile/updateProfile.zod';
import { UpdateAddressSchemaType } from '../../validations/User/profile/updateAdress.zod';

class ProfileController {
  public updateProfile = catchAsync(async (req: Request, res: Response) => {
    const id = req.userId;

    const { name, mobile, currentPassword, newPassword } =
      req.body as UpdateProfileSchemaType;

    const user = await userModel.findById(id);

    if (!user) return ExpressResponse.notFound(res, 'User not found');

    user.name = name;
    user.mobile = mobile;

    if (currentPassword && newPassword) {
      const isMatch = await bcryptCommon.comparePassword(
        currentPassword,
        user.password,
      );

      if (!isMatch) return ExpressResponse.badRequest(res, 'Invalid password');

      user.password = await bcryptCommon.hashingPassword(newPassword);
    }

    await user.save();

    return ExpressResponse.accepted(res, 'Profile updated successfully');
  });

  public updateAddress = catchAsync(async (req: Request, res: Response) => {
    const id = req.userId;

    const { address, city, state, zip, country, company } =
      req.body as UpdateAddressSchemaType;

    const userData = await userDataModel.findOne({ userId: id });

    if (!userData) return ExpressResponse.notFound(res, 'User not found');

    userData.address = address;
    userData.city = city;
    userData.state = state;
    userData.zipNumber = zip;
    userData.country = country;

    if (company) userData.company = company;

    await userData.save();

    return ExpressResponse.accepted(res, 'Address updated successfully');
  });

  public getProfile = catchAsync(async (req: Request, res: Response) => {
    const id = req.userId;

    const result = await userModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: 'userdatas',
          localField: '_id',
          foreignField: 'userId',
          as: 'userData',
        },
      },
      {
        $unwind: '$userData',
      },
      {
        $project: {
          _id: 1,
          name: 1,
          mobile: 1,
          address: '$userData.address' || '',
          city: '$userData.city' || '',
          state: '$userData.state' || '',
          zip: '$userData.zipNumber' || '',
          country: '$userData.country' || '',
          company: '$userData.company' || '',
        },
      },
    ]);

    if (!result) return ExpressResponse.notFound(res, 'User not found');

    return ExpressResponse.success(res, 'Success', { result });
  });

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

    const result = {
      _id: user._id,
      wallet: userData.wallet,
      name: user.name,
      isVerified: user.isVerified,
      defaultDiscount: maxdis,
      cart: userData.cart,
      isAddress,
    };

    return ExpressResponse.success(res, 'Success', { result });
  });

  public getMyCrates = catchAsync(async (req: Request, res: Response) => {
    const id = req.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // get all the crates and limited crates of the user in array of objects

    const result = await orderHistoryModel
      .find({ userId: id })
      .populate('crateId')
      .populate('limitedCrateId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(
      (await orderHistoryModel.countDocuments({ userId: id })) / limit,
    );

    return ExpressResponse.success(res, 'Success', { result, totalPages });
  });

  public getMyOrders = catchAsync(async (req: Request, res: Response) => {
    const id = req.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await orderHistoryModel
      .find({ userId: id })
      .populate('crateId')
      .populate('limitedCrateId')
      .populate('storeId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(
      (await orderHistoryModel.countDocuments({ userId: id })) / limit,
    );

    return ExpressResponse.success(res, 'Success', { result, totalPages });
  });

  public getMyRecuringOrders = catchAsync(
    async (req: Request, res: Response) => {
      const id = req.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await recurringPaymentModel
        .find({ userId: id })
        .populate('premiumCrateId')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalPages = Math.ceil(
        (await recurringPaymentModel.countDocuments({ userId: id })) / limit,
      );

      return ExpressResponse.success(res, 'Success', {
        result,
        totalPages,
      });
    },
  );

  public getReferredUsers = catchAsync(async (req: Request, res: Response) => {
    const id = req.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const userData = await userDataModel.findOne({ userId: id });

    if (!userData) return ExpressResponse.notFound(res, 'User not found');

    const result = await userModel
      .find({ referredBy: id })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(
      (await userModel.countDocuments({ referredBy: id })) / limit,
    );

    return ExpressResponse.success(res, 'Success', { result, totalPages });
  });
}

export default new ProfileController();

import { Request, Response } from 'express';
import mongoose from 'mongoose';

import crateModel from '../../models/crate.model';
import userDataModel from '../../models/userData.model';
import orderHistoryModel from '../../models/orderHistory.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

import { ReqCrateSchemaType } from '../../validations/Admin/crate/reqCrate.zod';
import { GiftCrateSchemaType } from '../../validations/Admin/crate/giftCrate.zod';

class CrateController {
  public getAllCrates = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const crates = await crateModel
      .find({ isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit);

    return ExpressResponse.success(res, 'Success', { crates });
  });

  public getCratesByCategory = catchAsync(
    async (req: Request, res: Response) => {
      const { category } = req.params;

      const crates = await crateModel.find({ category, isDeleted: false });

      return ExpressResponse.success(res, 'Success', { crates });
    },
  );

  public getCratesByGenre = catchAsync(async (req: Request, res: Response) => {
    const { genre } = req.params;

    const crates = await crateModel.find({ genre, isDeleted: false });

    return ExpressResponse.success(res, 'Success', { crates });
  });

  public getCratesByCast = catchAsync(async (req: Request, res: Response) => {
    const { cast } = req.params;

    // cast is an array of strings
    const crates = await crateModel.find({
      casts: { $in: [cast] },
      isDeleted: false,
    });

    return ExpressResponse.success(res, 'Success', { crates });
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

    return ExpressResponse.success(res, 'Success', {
      crate,
      crateOrderHistory,
    });
  });

  public createCrate = catchAsync(async (req: Request, res: Response) => {
    const { name, price, genre, plot, link, casts, trailer, category } =
      req.body as ReqCrateSchemaType;

    await crateModel.create({
      name,
      price,
      genre,
      plot,
      link,
      casts,
      trailer,
      category,
    });

    return ExpressResponse.created(res, 'Crate created successfully');
  });

  public updateCrate = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const { name, price, genre, plot, link, casts, trailer, category } =
      req.body as ReqCrateSchemaType;

    const updatedCrate = await crateModel.findByIdAndUpdate(
      id,
      {
        name,
        price,
        genre,
        plot,
        link,
        casts,
        trailer,
        category,
      },
      {
        new: true,
      },
    );

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

    const crates = await crateModel
      .find({ isDeleted: true })
      .skip((page - 1) * limit)
      .limit(limit);

    return ExpressResponse.success(res, 'Success', { crates });
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
      gateway: 'Gifted',
      price: crate.price,
      status: 'success',
      desc: `Gifted ${crate.name}`,
      method: 'gift',
      type: 'gift',
      product: 'crate',
    });

    user.crate.push(crate._id);
    user.orderHistory.push(giftedCrate._id);

    await user.save();

    return ExpressResponse.accepted(res, 'Crate gifted successfully');
  });
}

export default new CrateController();

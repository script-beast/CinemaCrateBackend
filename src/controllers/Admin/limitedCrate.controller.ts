import { Request, Response } from 'express';
import mongoose from 'mongoose';

import limitedCrateModel from '../../models/limitedCrate.model';
import orderHistoryModel from '../../models/orderHistory.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

import { ReqLimitedCrateSchemaType } from '../../validations/Admin/limitedCrate/reqLimitedCrate.zod';

class LimitedCrateController {
  public getAllLimitedCrates = catchAsync(
    async (req: Request, res: Response) => {
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

      if (req.query.occassion) {
        options = { ...options, occassion: req.query.occassion };
      }

      const result = await limitedCrateModel
        .find({ ...options, isDeleted: false, endTime: { $gte: new Date() } })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalPages = Math.ceil(
        (await limitedCrateModel.countDocuments({
          ...options,
          isDeleted: false,
          endTime: { $gte: new Date() },
        })) / limit,
      );

      return ExpressResponse.success(res, 'Success', {
        result,
        totalPages,
      });
    },
  );

  public getPastLimitedCrates = catchAsync(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await limitedCrateModel
        .find({ isDeleted: false, endTime: { $lt: new Date() } })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalPages = Math.ceil(
        (await limitedCrateModel.countDocuments({
          isDeleted: false,
          endTime: { $lt: new Date() },
        })) / limit,
      );

      return ExpressResponse.success(res, 'Success', {
        result,
        totalPages,
      });
    },
  );

  public getSingleLimitedCrate = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      const limitedCrate = await limitedCrateModel.findById(id);

      if (!limitedCrate) {
        return ExpressResponse.notFound(res, 'Limited Crate not found');
      }

      const limitedCrateOrderHistory = await orderHistoryModel.find({
        limitedCrateId: limitedCrate._id,
      });

      const result = {
        limitedCrate,
        limitedCrateOrderHistory,
      };

      return ExpressResponse.success(res, 'Success', { result });
    },
  );

  public createLimitedCrate = catchAsync(
    async (req: Request, res: Response) => {
      const parseDta = req.body as ReqLimitedCrateSchemaType;

      await limitedCrateModel.create(parseDta);

      return ExpressResponse.created(res, 'Limited Crate created successfully');
    },
  );

  public updateLimitedCrate = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      const parseDta = req.body as ReqLimitedCrateSchemaType;

      const updatedLimitedCrate = await limitedCrateModel.findByIdAndUpdate(
        id,
        parseDta,
        { new: true },
      );

      if (!updatedLimitedCrate) {
        return ExpressResponse.badRequest(res, 'Limited Crate not found');
      }

      return ExpressResponse.accepted(
        res,
        'Limited Crate updated successfully',
      );
    },
  );

  public deleteLimitedCrate = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      const deletedLimitedCrate = await limitedCrateModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
      );

      if (!deletedLimitedCrate) {
        return ExpressResponse.badRequest(res, 'Limited Crate not found');
      }

      return ExpressResponse.accepted(
        res,
        'Limited Crate deleted successfully',
      );
    },
  );

  public getDeletedLimitedCrates = catchAsync(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await limitedCrateModel
        .find({ isDeleted: true })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalPages = Math.ceil(
        (await limitedCrateModel.countDocuments({ isDeleted: true })) / limit,
      );

      return ExpressResponse.success(res, 'Success', {
        result,
        totalPages,
      });
    },
  );

  public restoreLimitedCrate = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      const restoredLimitedCrate = await limitedCrateModel.findByIdAndUpdate(
        id,
        { isDeleted: false },
        { new: true },
      );

      if (!restoredLimitedCrate) {
        return ExpressResponse.badRequest(res, 'Limited Crate not found');
      }

      return ExpressResponse.accepted(
        res,
        'Limited Crate restored successfully',
      );
    },
  );
}

export default new LimitedCrateController();

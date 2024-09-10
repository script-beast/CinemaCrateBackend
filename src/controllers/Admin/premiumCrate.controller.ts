import { Request, Response } from 'express';
import mongoose from 'mongoose';

import premiumCrateModel from '../../models/premiumCrate.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

import { ReqPremiumCrateSchemaType } from '../../validations/Admin/premiumCrate/reqPremiumCrate.zod';

class PremiumCrateController {
  public getAllPremiumCrates = catchAsync(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      let options = {};

      if (req.query.genre) {
        options = { ...options, genre: req.query.genre };
      }

      if (req.query.category) {
        options = { ...options, category: req.query.category };
      }

      if (req.query.cast) {
        options = { ...options, casts: { $in: [req.query.cast] } };
      }

      const result = await premiumCrateModel
        .find({ ...options, isDeleted: false })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalPages = Math.ceil(
        (await premiumCrateModel.countDocuments({
          ...options,
          isDeleted: false,
        })) / limit,
      );

      return ExpressResponse.success(res, 'Success', {
        result,
        totalPages,
      });
    },
  );

  public getSinglePremiumCrate = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      const result = await premiumCrateModel.findById(id);

      if (!result) {
        return ExpressResponse.notFound(res, 'Premium Crate not found');
      }

      return ExpressResponse.success(res, 'Success', { result });
    },
  );

  public createPremiumCrate = catchAsync(
    async (req: Request, res: Response) => {
      const parseDta = req.body as ReqPremiumCrateSchemaType;

      const result = await premiumCrateModel.create(parseDta);

      return ExpressResponse.success(res, 'Success', { result });
    },
  );

  public updatePremiumCrate = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const parseDta = req.body as ReqPremiumCrateSchemaType;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      const premiumCrate = await premiumCrateModel.findByIdAndUpdate(
        id,
        parseDta,
        { new: true },
      );

      if (!premiumCrate) {
        return ExpressResponse.notFound(res, 'Premium Crate not found');
      }

      return ExpressResponse.accepted(
        res,
        'Premium Crate updated successfully',
      );
    },
  );

  public deletePremiumCrate = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      await premiumCrateModel.findByIdAndUpdate(id, { isDeleted: true });

      return ExpressResponse.accepted(
        res,
        'Premium Crate deleted successfully',
      );
    },
  );

  public getDeletedPremiumCrates = catchAsync(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await premiumCrateModel
        .find({ isDeleted: true })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalPages = Math.ceil(
        (await premiumCrateModel.countDocuments({ isDeleted: true })) / limit,
      );

      return ExpressResponse.success(res, 'Success', {
        result,
        totalPages,
      });
    },
  );

  public restorePremiumCrate = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      await premiumCrateModel.findByIdAndUpdate(id, { isDeleted: false });

      return ExpressResponse.accepted(
        res,
        'Premium Crate restored successfully',
      );
    },
  );
}

export default new PremiumCrateController();

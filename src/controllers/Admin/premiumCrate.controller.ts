import { Request, Response } from 'express';
import mongoose from 'mongoose';

import premiumCrateModel from '../../models/premiumCrate.model';

import catchAsync from '../../utils/ErrorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

class PremiumCrateController {
  public getAllPremiumCrates = catchAsync(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const premiumCrates = await premiumCrateModel
        .find({ isDeleted: false })
        .skip((page - 1) * limit)
        .limit(limit);

      return ExpressResponse.success(res, 'Success', { premiumCrates });
    },
  );

  public getPremiumCratesByCategory = catchAsync(
    async (req: Request, res: Response) => {
      const { category } = req.params;

      const premiumCrates = await premiumCrateModel.find({
        category,
        isDeleted: false,
      });

      return ExpressResponse.success(res, 'Success', { premiumCrates });
    },
  );

  public getPremiumCratesByGenre = catchAsync(
    async (req: Request, res: Response) => {
      const { genre } = req.params;

      const premiumCrates = await premiumCrateModel.find({
        genre,
        isDeleted: false,
      });

      return ExpressResponse.success(res, 'Success', { premiumCrates });
    },
  );

  public getPremiumCratesByCast = catchAsync(
    async (req: Request, res: Response) => {
      const { cast } = req.params;

      // cast is an array of strings
      const premiumCrates = await premiumCrateModel.find({
        casts: { $in: [cast] },
        isDeleted: false,
      });

      return ExpressResponse.success(res, 'Success', { premiumCrates });
    },
  );

  public getSinglePremiumCrate = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      const premiumCrate = await premiumCrateModel.findById(id);

      return ExpressResponse.success(res, 'Success', { premiumCrate });
    },
  );

  public createPremiumCrate = catchAsync(
    async (req: Request, res: Response) => {
      const {
        name,
        price,
        genre,
        plot,
        link,
        casts,
        trailer,
        pageCount,
        category,
        monthlyPrice,
        yearlyPrice,
        discount,
      } = req.body;

      const premiumCrate = await premiumCrateModel.create({
        name,
        price,
        genre,
        plot,
        link,
        casts,
        trailer,
        pageCount,
        category,
        monthlyPrice,
        yearlyPrice,
        discount,
      });

      return ExpressResponse.success(res, 'Success', { premiumCrate });
    },
  );

  public updatePremiumCrate = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      const premiumCrate = await premiumCrateModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true },
      );

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

      const premiumCrates = await premiumCrateModel
        .find({ isDeleted: true })
        .skip((page - 1) * limit)
        .limit(limit);

      return ExpressResponse.success(res, 'Success', { premiumCrates });
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

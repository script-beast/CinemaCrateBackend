import { Request, Response } from 'express';
import mongoose from 'mongoose';

import limitedCrateModel from 'models/limitedCrate.model';
import orderHistoryModel from 'models/orderHistory.model';

import catchAsync from '../../utils/ErrorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

class LimitedCrateController {
  public getAllLimitedCrates = catchAsync(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const limitedCrates = await limitedCrateModel
        .find({ isDeleted: false, endTime: { $gte: new Date() } })
        .skip((page - 1) * limit)
        .limit(limit);

      return ExpressResponse.success(res, 'Success', { limitedCrates });
    },
  );

  public getPastLimitedCrates = catchAsync(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const pastLimitedCrates = await limitedCrateModel
        .find({ isDeleted: false, endTime: { $lt: new Date() } })
        .skip((page - 1) * limit)
        .limit(limit);

      return ExpressResponse.success(res, 'Success', { pastLimitedCrates });
    },
  );

  public getLimitedCrateByCategory = catchAsync(
    async (req: Request, res: Response) => {
      const { category } = req.params;

      const limitedCrates = await limitedCrateModel.find({
        category,
        isDeleted: false,
      });

      return ExpressResponse.success(res, 'Success', { limitedCrates });
    },
  );

  public getLimitedCrateByOccassion = catchAsync(
    async (req: Request, res: Response) => {
      const { occassion } = req.params;

      const limitedCrates = await limitedCrateModel.find({
        occassion,
        isDeleted: false,
      });

      return ExpressResponse.success(res, 'Success', { limitedCrates });
    },
  );

  public getLimitedCrateByGenre = catchAsync(
    async (req: Request, res: Response) => {
      const { genre } = req.params;

      const limitedCrates = await limitedCrateModel.find({
        genre,
        isDeleted: false,
      });

      return ExpressResponse.success(res, 'Success', { limitedCrates });
    },
  );

  public getLimitedCrateByCast = catchAsync(
    async (req: Request, res: Response) => {
      const { cast } = req.params;

      // cast is an array of strings
      const limitedCrates = await limitedCrateModel.find({
        casts: { $in: [cast] },
        isDeleted: false,
      });

      return ExpressResponse.success(res, 'Success', { limitedCrates });
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

      return ExpressResponse.success(res, 'Success', {
        limitedCrate,
        limitedCrateOrderHistory,
      });
    },
  );

  public createLimitedCrate = catchAsync(
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
        endTime,
        discountPrice,
        occassion,
        tagLine,
      } = req.body;

      const newLimitedCrate = await limitedCrateModel.create({
        name,
        price,
        genre,
        plot,
        link,
        casts,
        trailer,
        pageCount,
        category,
        endTime,
        discountPrice,
        occassion,
        tagLine,
      });

      return ExpressResponse.created(res, 'Limited Crate created successfully');
    },
  );

  public updateLimitedCrate = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

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
        endTime,
        discountPrice,
        occassion,
        tagLine,
      } = req.body;

      const updatedLimitedCrate = await limitedCrateModel.findByIdAndUpdate(
        id,
        {
          name,
          price,
          genre,
          plot,
          link,
          casts,
          trailer,
          pageCount,
          category,
          endTime,
          discountPrice,
          occassion,
          tagLine,
        },
        { new: true },
      );

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

      await limitedCrateModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
      );

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

      const deletedLimitedCrates = await limitedCrateModel
        .find({ isDeleted: true })
        .skip((page - 1) * limit)
        .limit(limit);

      return ExpressResponse.success(res, 'Success', { deletedLimitedCrates });
    },
  );

  public restoreLimitedCrate = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ExpressResponse.badRequest(res, 'Invalid ID');
      }

      await limitedCrateModel.findByIdAndUpdate(
        id,
        { isDeleted: false },
        { new: true },
      );

      return ExpressResponse.accepted(
        res,
        'Limited Crate restored successfully',
      );
    },
  );
}

export default new LimitedCrateController();

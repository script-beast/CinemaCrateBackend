import mongoose from 'mongoose';
import { Response, Request } from 'express';

import userDataModel from '../../models/userData.model';
import premiumCrateModel from '../../models/premiumCrate.model';
import orderHistoryModel from '../../models/orderHistory.model';
import transactionModel from '../../models/transaction.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';

import ExpressResponse from '../../libs/express/response.libs';

class premiumCrateController {
  public allActivepremiumCrates = catchAsync(
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

  public premiumCrateById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const result = await premiumCrateModel
      .findById(id)
      .select('-isDeleted -links');

    if (!result) {
      return ExpressResponse.notFound(res, 'Crate not found');
    }

    ExpressResponse.success(res, 'Success', { result });
  });
}

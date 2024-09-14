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
      let key = ['premiumCrate', String(page), String(limit), '', '', ''];

      if (req.query.genre) {
        options = { ...options, genre: req.query.genre };
        key[3] = String(req.query.genre);
      }

      if (req.query.category) {
        options = { ...options, category: req.query.category };
        key[4] = String(req.query.category);
      }

      if (req.query.cast) {
        options = { ...options, casts: { $in: [req.query.cast] } };
        key[5] = String(req.query.cast);
      }

      const result = await premiumCrateModel
        .find({ ...options, isDeleted: false })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await premiumCrateModel.countDocuments({
        ...options,
        isDeleted: false,
      });

      return ExpressResponse.success(res, 'Success', {
        result,
        total,
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

    // store in json format

    ExpressResponse.success(res, 'Success', { result });
  });
}

export default new premiumCrateController();

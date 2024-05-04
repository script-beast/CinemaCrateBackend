import mongoose from 'mongoose';
import { Response, Request } from 'express';

import userDataModel from '../../models/userData.model';
import premiumCrateModel from '../../models/premiumCrate.model';
import orderHistoryModel from '../../models/orderHistory.model';
import transactionModel from '../../models/transaction.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';

import ExpressResponse from '../../libs/express/response.libs';

import redisConnection from '../../connections/redis.connection';

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

      const cache = await redisConnection.get(key.join(':'));

      if (cache) {
        const { result, totalPages } = JSON.parse(cache);
        return ExpressResponse.success(res, 'Success', { result, totalPages });
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

      redisConnection.setex(
        key.join(':'),
        900,
        JSON.stringify({ result, totalPages }),
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

    const cache = await redisConnection.get(`premiumCrate:${id}`);

    if (cache) {
      const result = JSON.parse(cache);
      return ExpressResponse.success(res, 'Success', { result });
    }

    const result = await premiumCrateModel
      .findById(id)
      .select('-isDeleted -links');

    if (!result) {
      return ExpressResponse.notFound(res, 'Crate not found');
    }


    // store in json format
    redisConnection.setex(`premiumCrate:${id}`, 900, JSON.stringify(result));

    ExpressResponse.success(res, 'Success', { result });
  });
}

export default new premiumCrateController();

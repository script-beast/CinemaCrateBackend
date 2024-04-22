import mongoose from 'mongoose';
import { Response, Request } from 'express';

import crateModel from '../../models/crate.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';

import ExpressResponse from '../../libs/express/response.libs';

class CrateController {
  public allActiveCrates = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await crateModel
      .find({ isActive: true })
      .select('-link')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(
      (await crateModel.countDocuments({ isActive: true })) / limit,
    );

    ExpressResponse.success(res, 'Success', { result, totalPages });
  });

  public crateById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const result = await crateModel.findById(id);

    if (!result) {
      return ExpressResponse.notFound(res, 'Crate not found');
    }

    ExpressResponse.success(res, 'Success', { result });
  });
}

export default new CrateController();

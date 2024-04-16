import mongoose from 'mongoose';
import { Response, Request } from 'express';

import crateModel from '../../models/crate.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';

import ExpressResponse from '../../libs/express/response.libs';

class CrateController {
  public allActiveCrates = catchAsync(async (req: Request, res: Response) => {
    const crates = await crateModel.find({ isActive: true }).select('-link');

    ExpressResponse.success(res, 'Success', crates);
  });

  public crateById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const crate = await crateModel.findById(id);

    ExpressResponse.success(res, 'Success', crate);
  });
}

export default new CrateController();

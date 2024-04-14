import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import jwtCommon from '../libs/jwt/common.libs';
import ExpressResponse from '../libs/express/response.libs';

import catchAsync from '../utils/errorHandling/catchAsync.utils';

import userModel from '../models/user.model';

const userAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization)
      return ExpressResponse.unauthorized(res, 'Unauthorized');

    const token = req.headers.authorization.split(' ')[1];

    const decoded = jwtCommon.verifyToken(token);

    if (!decoded) return ExpressResponse.unauthorized(res, 'Unauthorized');

    if (typeof decoded === 'string')
      return ExpressResponse.unauthorized(res, 'Unauthorized');

    if (!mongoose.Types.ObjectId.isValid(decoded.id))
      return ExpressResponse.unauthorized(res, 'Unauthorized');

    const user = await userModel.findById(decoded.id);

    if (!user) return ExpressResponse.unauthorized(res, 'Unauthorized');

    req.userId = user._id;

    next();
  },
);

export default userAuth;

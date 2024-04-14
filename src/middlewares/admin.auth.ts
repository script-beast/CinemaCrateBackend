import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import jwtCommon from '../libs/jwt/common.libs';
import ExpressResponse from '../libs/express/response.libs';

import catchAsync from '../utils/ErrorHandling/catchAsync.utils';

import adminModel from '../models/admin.model';

// extend Request interface to include userId

const adminAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization)
      return ExpressResponse.unauthorized(res, 'Unauthorized');

    const token = req.headers.authorization.split(' ')[1];

    const decoded = jwtCommon.verifyToken(token);

    if (!decoded) return ExpressResponse.unauthorized(res, 'Unauthorized');

    if (typeof decoded === 'string')
      return ExpressResponse.unauthorized(res, 'Unauthorized');

    const admin = await adminModel.findById(decoded.id);

    if (!admin) return ExpressResponse.unauthorized(res, 'Unauthorized');

    req.userId = admin._id;

    next();
  },
);

export default adminAuth;

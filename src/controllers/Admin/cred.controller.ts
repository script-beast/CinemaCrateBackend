import { Response, Request } from 'express';

import adminModel from '../../models/admin.model';

import jwtCommon from '../../libs/jwt/common.libs';
import bcryptCommon from '../../libs/bcrypt/common.libs';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';

import ExpressResponse from '../../libs/express/response.libs';

import { RegisterSchemaType } from '../../validations/Admin/cred/register.zod';
import { LoginSchemaType } from '../../validations/Admin/cred/login.zod';

class CredController {
  public register = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body as RegisterSchemaType;

    const existingAdmin = await adminModel.findOne({ email });

    if (existingAdmin) ExpressResponse.badRequest(res, 'Admin already exists');

    const hashedPassword = await bcryptCommon.hashingPassword(password);

    const admin = new adminModel({
      name,
      email,
      password: hashedPassword,
    });

    await admin.save();

    ExpressResponse.created(res, 'Admin created successfully');
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginSchemaType;

    const admin = await adminModel.findOne({ email });

    if (!admin) return ExpressResponse.badRequest(res, 'No Account Found');

    const isMatch = await bcryptCommon.comparePassword(
      password,
      admin.password,
    );

    if (!isMatch) return ExpressResponse.badRequest(res, 'Invalid credentials');

    const token = jwtCommon.generateToken(admin._id);

    ExpressResponse.success(res, 'Login successful', { result: token });
  });
}

export default new CredController();

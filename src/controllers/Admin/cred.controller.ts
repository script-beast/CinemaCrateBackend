import { Response, Request } from 'express';

import adminModel from '../../models/admin.model';

import jwtCommon from '../../libs/jwt/common.libs';
import bcryptCommon from '../../libs/bcrypt/common.libs';

import catchAsync from '../../utils/ErrorHandling/catchAsync.utils';
import ExpressError from '../../utils/ErrorHandling/expressError.utils';

class CredController {
  public register = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingAdmin = await adminModel.findOne({ email });

    if (existingAdmin) throw new ExpressError(400, 'Admin already exists');

    const hashedPassword = await bcryptCommon.hashingPassword(password);

    const admin = new adminModel({
      name,
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({ msg: 'Admin created' });
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email });

    if (!admin) throw new ExpressError(400, 'Invalid credentials');

    const isMatch = await bcryptCommon.comparePassword(
      password,
      admin.password,
    );

    if (!isMatch) throw new ExpressError(400, 'Invalid credentials');

    const token = jwtCommon.generateToken(admin._id);

    res.status(200).json({ token });
  });
}

export default CredController;

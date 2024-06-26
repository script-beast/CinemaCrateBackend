import mongoose from 'mongoose';
import { Response, Request } from 'express';

import userModel from '../../models/user.model';
import userDataModel from '../../models/userData.model';

import jwtCommon from '../../libs/jwt/common.libs';
import bcryptCommon from '../../libs/bcrypt/common.libs';

import nodeMailerUtils from '../../utils/mailService/services/nodeMailer.utils';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

import { RegisterSchemaType } from '../../validations/User/cred/register.zod';
import { LoginSchemaType } from '../../validations/User/cred/login.zod';
import { GenerateVerificationOTPSchemaType } from '../../validations/User/cred/generateverificationOTP.zod';
import { VerifyOTPSchemaType } from '../../validations/User/cred/verifyOTP.zod';
import { GenerateResetPassOTPSchemaType } from '../../validations/User/cred/generateResetPassOTP.zod';
import { ResetPasswordSchemaType } from '../../validations/User/cred/resetPassword.zod';
import { RefreshTokenSchemaType } from '../../validations/User/cred/refreshToken.zod';

class CredController {
  public register = catchAsync(async (req: Request, res: Response) => {
    const { name, email, mobile, password, refBy } =
      req.body as RegisterSchemaType;

    const existingUser = await userModel.findOne({ email: email });

    if (existingUser)
      return ExpressResponse.badRequest(res, 'User already exists');

    const hashedPassword = await bcryptCommon.hashingPassword(password);

    const user = new userModel({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    await user.save();

    // generate referral code 6 characters long

    let referralCode = Math.random()
      .toString(36)
      .substring(2, 12)
      .toUpperCase();

    const userData = new userDataModel({
      userId: user._id,
      wallet: 0,
      referralCode,
    });

    await userData.save();

    user.userDataId = userData._id;

    await user.save();

    if (refBy) {
      const refUser = await userDataModel.findOne({ referralCode: refBy });

      if (!refUser)
        return ExpressResponse.badRequest(res, 'Invalid referral code');

      userData.referredBy = refUser._id;

      await userData.save();
    }

    ExpressResponse.created(res, 'User created successfully');
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginSchemaType;

    const user = await userModel.findOne({ email });

    if (!user) return ExpressResponse.badRequest(res, 'No Account Found');

    if (user.status !== 'active')
      return ExpressResponse.forbidden(res, user.remark);

    if (!user.isVerified)
      return ExpressResponse.forbidden(res, 'Account not verified');

    const isMatch = await bcryptCommon.comparePassword(password, user.password);

    if (!isMatch) return ExpressResponse.badRequest(res, 'Invalid credentials');

    const token = jwtCommon.generateToken(user._id);
    const refreshToken = jwtCommon.generateRefreshToken(user._id);

    const result = { token, refreshToken };

    ExpressResponse.success(res, 'Login successful', { result });
  });

  public generateVerificationOTP = catchAsync(
    async (req: Request, res: Response) => {
      const { email } = req.body as GenerateVerificationOTPSchemaType;

      const user = await userModel.findOne({ email });

      if (!user) return ExpressResponse.badRequest(res, 'No Account Found');

      if (user.status !== 'active')
        return ExpressResponse.forbidden(res, user.remark);

      if (user.isVerified)
        return ExpressResponse.badRequest(res, 'Already verified');

      const otp = Math.floor(100000 + Math.random() * 900000);

      user.verificationCode = otp;
      user.verificationCodeExpires = new Date(Date.now() + 600000);

      await user.save();

      nodeMailerUtils.sendOTP(email, user.name, otp);

      ExpressResponse.created(res, 'OTP sent successfully');
    },
  );

  public verifyOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body as VerifyOTPSchemaType;

    const user = await userModel.findOne({ email });

    if (!user) return ExpressResponse.badRequest(res, 'No Account Found');

    if (user.status !== 'active')
      return ExpressResponse.forbidden(res, user.remark);

    if (user.isVerified)
      return ExpressResponse.badRequest(res, 'Already verified');

    if (user.verificationCodeExpires < new Date())
      return ExpressResponse.badRequest(res, 'OTP expired');

    if (user.verificationCode !== otp)
      return ExpressResponse.badRequest(res, 'Invalid OTP');

    user.isVerified = true;

    await user.save();

    ExpressResponse.created(res, 'OTP verified successfully');
  });

  public generateResetPassOTP = catchAsync(
    async (req: Request, res: Response) => {
      const { email } = req.body as GenerateResetPassOTPSchemaType;

      const user = await userModel.findOne({ email });

      if (!user) return ExpressResponse.badRequest(res, 'No Account Found');

      if (user.status !== 'active')
        return ExpressResponse.forbidden(res, user.remark);

      const otp = Math.floor(100000 + Math.random() * 900000);

      user.verificationCode = 909090;
      user.verificationCodeExpires = new Date(Date.now() + 600000);

      await user.save();

      // Send OTP to user email

      ExpressResponse.created(res, 'OTP sent successfully');
    },
  );

  public resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email, otp, password } = req.body as ResetPasswordSchemaType;

    const user = await userModel.findOne({ email });

    if (!user) return ExpressResponse.badRequest(res, 'No Account Found');

    if (user.status !== 'active')
      return ExpressResponse.forbidden(res, user.remark);

    if (user.verificationCodeExpires < new Date())
      return ExpressResponse.badRequest(res, 'OTP expired');

    if (user.verificationCode !== otp)
      return ExpressResponse.badRequest(res, 'Invalid OTP');

    const hashedPassword = await bcryptCommon.hashingPassword(password);

    user.password = hashedPassword;
    user.verificationCode = 0;
    user.verificationCodeExpires = new Date();

    await user.save();

    ExpressResponse.created(res, 'Password reset successfully');
  });

  public refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body as RefreshTokenSchemaType;

    const decoded = jwtCommon.verifyRefreshToken(refreshToken);

    if (!decoded) return ExpressResponse.badRequest(res, 'Invalid token');
    if (typeof decoded === 'string')
      return ExpressResponse.badRequest(res, 'Invalid token');

    if (!mongoose.Types.ObjectId.isValid(decoded?.id))
      return ExpressResponse.badRequest(res, 'Invalid token');

    const user = await userModel.findById(decoded?.id);

    if (!user) return ExpressResponse.badRequest(res, 'Invalid token');

    const token = jwtCommon.generateToken(user._id);

    ExpressResponse.success(res, 'Token refreshed successfully', {
      result: token,
    });
  });
}

export default new CredController();

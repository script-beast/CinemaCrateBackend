import mongoose from 'mongoose';

type UserTpye = {
  _id: mongoose.Types.ObjectId;
  userDataId: mongoose.Types.ObjectId;
  email: string;
  name: string;
  password: string;
  mobile: number;
  isVerified: Boolean;
  verificationCode: number;
  verificationCodeExpires: Date;
  status: string;
  remark: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export default UserTpye;

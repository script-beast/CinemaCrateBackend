import mongoose from 'mongoose';
import userType from '../interfaces/models/user.types';

const userSchema = new mongoose.Schema<userType>(
  {
    userDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userData',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
    },
    verificationCode: {
      type: Number,
      required: true,
    },
    verificationCodeExpires: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<userType>('user', userSchema);

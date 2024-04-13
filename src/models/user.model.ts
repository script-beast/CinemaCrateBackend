import mongoose from 'mongoose';
import userType from '../interfaces/models/user.types';

const userSchema = new mongoose.Schema<userType>(
  {
    userDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userData',
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
      default: false,
    },
    verificationCode: {
      type: Number,
    },
    verificationCodeExpires: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active',
    },
    remark: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<userType>('user', userSchema);

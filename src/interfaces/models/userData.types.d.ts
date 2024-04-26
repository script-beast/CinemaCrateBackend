import mongoose from 'mongoose';

type userDataType = {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  wallet: number;
  referralCode: string;
  referredBy: mongoose.Types.ObjectId;
  address: string;
  city: string;
  state: string;
  country: string;
  zipNumber: number;
  company: string;
  crate: mongoose.Types.ObjectId[];
  limitedCrate: mongoose.Types.ObjectId[];
  premiumCrate: mongoose.Types.ObjectId[];
  store: mongoose.Types.ObjectId[];
  orderHistory: mongoose.Types.ObjectId[];
  recurringOrder: mongoose.Types.ObjectId[];
  transaction: mongoose.Types.ObjectId[];
  cart: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export default userDataType;

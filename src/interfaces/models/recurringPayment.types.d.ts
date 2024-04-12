import mongoose from 'mongoose';

type recurringPaymentType = {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  premiumCrateId: mongoose.Types.ObjectId;
  gateway: string;
  paymentId: string;
  price: Number;
  status: string;
  duration: string;
  createdAt: Date;
  updatedAt: Date;
  __v: Number;
};

export default recurringPaymentType;

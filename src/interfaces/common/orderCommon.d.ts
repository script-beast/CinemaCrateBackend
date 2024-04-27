import mongoose from 'mongoose';

type orderCommonType = {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  storeId?: mongoose.Types.ObjectId;
  crateId?: mongoose.Types.ObjectId;
  limitedCrateId?: mongoose.Types.ObjectId;
  gateway: string;
  price: number;
  product: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export default orderCommonType;

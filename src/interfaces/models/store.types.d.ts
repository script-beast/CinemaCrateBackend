import mongoose from 'mongoose';

type storeType = {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export default storeType;

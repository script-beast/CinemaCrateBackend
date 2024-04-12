import mongoose from 'mongoose';

type adminType = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export default adminType;

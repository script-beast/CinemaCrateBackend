import mongoose from 'mongoose';

type contactType = {
  _id: mongoose.Types.ObjectId;
  fName: string;
  lName: string;
  email: string;
  mobile: string;
  message: string;
  isReplied: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export default contactType;

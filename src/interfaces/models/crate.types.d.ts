import mongoose from 'mongoose';

type crateType = {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  genre: string;
  plot: string;
  link: string;
  casts: string[];
  trailer: string;
  isDeleted: Boolean;
  pageCount: number;
  category: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export default crateType;

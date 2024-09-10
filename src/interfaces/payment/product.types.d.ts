import mongoose from 'mongoose';

type productType = {
  _id: mongoose.Types.ObjectId;
  name: string;
};

export default productType;

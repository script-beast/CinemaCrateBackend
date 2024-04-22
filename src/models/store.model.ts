import mongoose from 'mongoose';
import storeType from '../interfaces/models/store.types';

const storeSchema = new mongoose.Schema<storeType>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<storeType>('store', storeSchema);

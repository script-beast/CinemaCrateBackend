import mongoose from 'mongoose';
import crateType from '../interfaces/models/crate.types';

const crateSchema = new mongoose.Schema<crateType>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    plot: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    casts: {
      type: [String],
      required: true,
    },
    trailer: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
    },
    pageCount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<crateType>('crate', crateSchema);

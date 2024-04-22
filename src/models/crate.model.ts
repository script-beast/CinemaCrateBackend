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
    category: {
      type: String,
      enum: ['movie', 'web-series', 'anime'],
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
      default: false,
    },
    pageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<crateType>('crate', crateSchema);

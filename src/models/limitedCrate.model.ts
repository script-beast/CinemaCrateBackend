import mongoose from 'mongoose';
import limitedCrateType from '../interfaces/models/limitedCrate.types';

const limitedCrateSchema = new mongoose.Schema<limitedCrateType>(
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
      default: false,
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    occassion: {
      type: String,
      required: true,
    },
    tagLine: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<limitedCrateType>(
  'limitedCrate',
  limitedCrateSchema,
);

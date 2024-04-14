import mongoose from 'mongoose';
import premiumCrateType from '../interfaces/models/premiumCrate.types';

const premiumCrateSchema = new mongoose.Schema<premiumCrateType>(
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
    monthlyPrice: {
      type: Number,
      required: true,
    },
    yearlyPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<premiumCrateType>(
  'premiumCrate',
  premiumCrateSchema,
);

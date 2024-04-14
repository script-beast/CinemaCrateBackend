import mongoose from 'mongoose';
import transactionType from '../interfaces/models/transaction.types';

const transactionSchema = new mongoose.Schema<transactionType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userData',
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'store',
    },
    crateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'crate',
    },
    limitedCrateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'limitedCrate',
    },
    gateway: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
      enum: ['store', 'crate', 'limitedCrate'],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<transactionType>(
  'transaction',
  transactionSchema,
);

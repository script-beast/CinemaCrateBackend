import mongoose from 'mongoose';
import orderHistoryType from '../interfaces/models/orderHistory.types';

const orderHistorySchema = new mongoose.Schema<orderHistoryType>(
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
      enum: ['Stripe', 'Razorpay', 'Gifted'],
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
      enum: ['wallet', 'card', 'gift'],
    },
    type: {
      type: String,
      required: true,
      enum: ['credit', 'debit', 'gift'],
    },
    product: {
      type: String,
      required: true,
      enum: ['store', 'crate', 'limitedCrate'],
    },
  },
  { timestamps: true },
);

export default mongoose.model<orderHistoryType>(
  'orderHistory',
  orderHistorySchema,
);

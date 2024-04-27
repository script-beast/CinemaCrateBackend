import mongoose from 'mongoose';
import orderHistoryType from '../interfaces/models/orderHistory.types';
import {
  paymentGateway,
  paymentType,
  product,
} from '../interfaces/common/payment.enum';

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
      enum: paymentGateway,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: paymentType,
    },
    product: {
      type: String,
      required: true,
      enum: product,
    },
  },
  { timestamps: true },
);

export default mongoose.model<orderHistoryType>(
  'orderHistory',
  orderHistorySchema,
);

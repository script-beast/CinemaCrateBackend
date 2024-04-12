import mongoose from 'mongoose';
import recurringPaymentType from '../interfaces/models/recurringPayment.types';

const recurringPaymentSchema = new mongoose.Schema<recurringPaymentType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userData',
      required: true,
    },
    premiumCrateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'premiumCrate',
      required: true,
    },
    gateway: {
      type: String,
      required: true,
    },
    paymentId: {
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
    duration: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<recurringPaymentType>(
  'recurringPayment',
  recurringPaymentSchema,
);

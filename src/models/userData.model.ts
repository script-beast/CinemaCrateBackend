import mongoose from 'mongoose';
import userDataType from '../interfaces/models/userData.types';

const userDataSchema = new mongoose.Schema<userDataType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    wallet: {
      type: Number,
      required: true,
    },
    referralCode: {
      type: String,
      required: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userData',
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    zipNumber: {
      type: Number,
    },
    company: {
      type: String,
    },
    crate: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'crate',
    },
    limitedCrate: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'limitedCrate',
    },
    premiumCrate: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'premiumCrate',
    },
    store: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'store',
    },
    orderHistory: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'orderHistory',
    },
    recurringOrder: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'recurringOrder',
    },
    transaction: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'transaction',
    },
    cart: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'crate',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<userDataType>('userData', userDataSchema);

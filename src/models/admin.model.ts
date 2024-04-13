import mongoose from 'mongoose';
import adminType from '../interfaces/models/admin.types';

const adminSchema = new mongoose.Schema<adminType>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<adminType>('admin', adminSchema);

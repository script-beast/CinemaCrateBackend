import mongoose from 'mongoose';
import contactType from '../interfaces/models/contact.types';

const contactSchema = new mongoose.Schema<contactType>(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isReplied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<contactType>('contact', contactSchema);

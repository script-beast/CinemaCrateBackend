import mongoose from 'mongoose';

type UserTpye = {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  mobile: number;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: number;
};

export default UserTpye;

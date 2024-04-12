import mongoose from 'mongoose';

class MongoConnection {
  private connectUrl: string;

  constructor() {
    this.connectUrl = process.env.MONGO_URL ?? '';
  }

  public connect = async () => {
    try {
      await mongoose.connect(this.connectUrl);
      console.log('Connected to MongoDB');
    } catch (error) {
      throw new Error('Error connecting to MongoDB');
    }
  };
}

export default MongoConnection;

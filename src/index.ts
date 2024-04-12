import dotenv from 'dotenv';
dotenv.config();

import expressConnection from './connections/express.connection';
import mongooseConnection from './connections/mongo.connection';

const app = new expressConnection();
const mongoose = new mongooseConnection();

mongoose
  .connect()
  .then(() => {
    app.start(Number(process.env.PORT));
  })
  .catch((error) => {
    console.log(error);
  });

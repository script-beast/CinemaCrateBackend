import dotenv from 'dotenv';
dotenv.config();

import expressConnection from './connections/express.connection';

const app = new expressConnection();
app.start(Number(process.env.PORT));

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyPraser from 'body-parser';

import ExpressError from '../libs/express/error.libs';
import ExpressErrorMidelleware from '../middlewares/errorHandle.error';

import adminRoutes from '../routes/admin.routes';
import userRoutes from '../routes/user.routes';

import resquestExtend from '../interfaces/express/request.extend.interface';

export default class ExpressConnection {
  private app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(morgan('dev'));
    this.app.use(bodyPraser.json({ limit: '30mb' }));
    this.app.use(bodyPraser.urlencoded({ limit: '30mb', extended: true }));
  }

  private routes() {
    this.app.get('/test', (req: Request, res: Response, next: NextFunction) => {
      res.json({ message: 'Hello World' });
    });
    this.app.use('/admin', adminRoutes);
    this.app.use('/user', userRoutes);
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new ExpressError(404, 'Not Found'));
    });
    this.app.use(ExpressErrorMidelleware);
  }

  public start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

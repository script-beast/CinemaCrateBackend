import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyPraser from 'body-parser';

import ExpressError from '../utils/ErrorHandling/expressError.utils';
import ExpressErrorMidelleware from '../middlewares/errorHandle.error';

import adminRoutes from '../routes/admin.routes';

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
      next(new ExpressError(401, 'Test for error handling'));
    });
    this.app.use('/admin', adminRoutes);
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

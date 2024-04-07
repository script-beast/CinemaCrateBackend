import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyPraser from 'body-parser';

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
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Hello World');
    });
  }

  public start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

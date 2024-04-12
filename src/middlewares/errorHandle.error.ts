import { NextFunction, Request, Response } from 'express';
import ErrorInterface from '../interfaces/express/error.interface';

const ErrorHandlingMidelware = (
  err: ErrorInterface,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    status = 500,
    error = 'Internal Server Error',
    errorDev = err.message,
  } = err;
  res.status(status).send({ error, errorDev });
};

export default ErrorHandlingMidelware;

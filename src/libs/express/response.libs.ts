import { Response } from 'express';
import responseCodeEnum from '../../interfaces/express/response.enum.interface';

class ExpressResponse {
  public static created(res: Response, msg: string): void {
    res.status(responseCodeEnum.created).json({ msg });
  }

  public static success(res: Response, msg: string, data: any): void {
    res.status(responseCodeEnum.success).json({ msg, data });
  }

  public static badRequest(res: Response, error: string): void {
    res.status(responseCodeEnum.badRequest).json({ error });
  }

  public static unauthorized(res: Response, error: string): void {
    res.status(responseCodeEnum.unauthorized).json({ error });
  }

  public static forbidden(res: Response, error: string): void {
    res.status(responseCodeEnum.forbidden).json({ error });
  }

  public static notFound(res: Response, error: string): void {
    res.status(responseCodeEnum.notFound).json({ error });
  }

  public static internalServerError(
    res: Response,
    error: string,
    errorDev: string,
  ): void {
    res.status(responseCodeEnum.internalServerError).json({ error, errorDev });
  }
}

export default ExpressResponse;

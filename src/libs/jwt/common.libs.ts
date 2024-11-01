import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { jwtDecode } from 'jwt-decode';

class jwtCommon {
  private static jwtSecret: string = process.env.JWT_SECRET!;
  private static jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET!;
  private static jwtExpiresIn: string = '1d';
  private static jwtRefreshExpiresIn: string = '1y';

  public static generateToken: (id: mongoose.Types.ObjectId) => string = (
    id: mongoose.Types.ObjectId,
  ) => {
    return jwt.sign({ id }, jwtCommon.jwtSecret, {
      expiresIn: jwtCommon.jwtExpiresIn,
    });
  };

  public static generateRefreshToken: (id: mongoose.Types.ObjectId) => string =
    (id: mongoose.Types.ObjectId) => {
      return jwt.sign({ id }, jwtCommon.jwtRefreshSecret, {
        expiresIn: jwtCommon.jwtRefreshExpiresIn,
      });
    };

  public static verifyToken = (token: string) => {
    return jwt.verify(token, jwtCommon.jwtSecret);
  };

  public static decodeToken = (token: string) => {
    return jwt.decode(token);
  };

  public static verifyRefreshToken = (token: string) => {
    return jwt.verify(token, jwtCommon.jwtRefreshSecret);
  };

  public static isTokenExpired = (token: string) => {
    const decoded = jwtDecode(token);
    if (!decoded) return true;
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  };
}

export default jwtCommon;

import bcrypt from 'bcryptjs';

class bcryptCommon {
  public static hashingPassword: (password: string) => Promise<string> = async (
    password: string,
  ) => {
    return await bcrypt.hash(password, 12);
  };

  public static comparePassword: (
    password: string,
    hashedPassword: string,
  ) => Promise<boolean> = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
  };
}

export default bcryptCommon;

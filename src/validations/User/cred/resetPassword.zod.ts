import { z } from 'zod';

// const { email, otp, password } = req.body;

const resetPasswordSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    otp: z
      .number({ required_error: 'OTP is required' })
      .int({ message: 'OTP should be an integer' })
      .min(100000, { message: 'OTP should be atleast 6 digits' })
      .max(999999, { message: 'OTP should be atmost 6 digits' }),
    password: z
      .string({ required_error: 'Password is required' })
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message:
          'Password should contain atleast one uppercase, one lowercase, one number and one special character',
      })
      .min(8, { message: 'Password should be atleast 8 characters long' })
      .max(50, { message: 'Password should be atmost 50 characters long' }),
  })
  .strict();

export default resetPasswordSchema;
type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export { ResetPasswordSchemaType };

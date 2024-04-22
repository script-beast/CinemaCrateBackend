import { z } from 'zod';

const verifyOTPSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    otp: z
      .number({ required_error: 'OTP is required' })
      .int({ message: 'OTP should be an integer' })
      .min(100000, { message: 'OTP should be atleast 6 digits' })
      .max(999999, { message: 'OTP should be atmost 6 digits' }),
  })
  .strict();

type VerifyOTPSchemaType = z.infer<typeof verifyOTPSchema>;
export { VerifyOTPSchemaType };
export default verifyOTPSchema;

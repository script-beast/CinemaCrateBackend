import { z } from 'zod';

const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(3, { message: 'Name should be atleast 3 characters long' })
      .max(50, { message: 'Name should be atmost 50 characters long' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    password: z
      .string({ required_error: 'Password is required' })
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message:
          'Password should contain atleast one uppercase, one lowercase, one number and one special character',
      })
      .min(8, { message: 'Password should be atleast 8 characters long' })
      .max(50, { message: 'Password should be atmost 50 characters long' }),
    mobile: z
      .number({ required_error: 'Mobile is required' })
      .int()
      .min(1000000000, {
        message: 'Mobile should be atleast 10 characters long',
      })
      .max(99999999999, {
        message: 'Mobile should be atmost 10 characters long',
      }),
    refBy: z
      .string({ required_error: 'Referral code is required' })
      .min(10, {
        message: 'Referral code should be atleast 10 characters long',
      })
      .max(10, { message: 'Referral code should be atmost 10 characters long' })
      .transform((data) => data.toUpperCase())
      .optional(),
  })
  .strict();

export default registerSchema;
type RegisterSchemaType = z.infer<typeof registerSchema>;
export { RegisterSchemaType };

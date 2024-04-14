import { z } from 'zod';

const loginSchema = z
  .object({
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
  })
  .strict();

export default loginSchema;
type LoginSchemaType = z.infer<typeof loginSchema>;
export { LoginSchemaType };

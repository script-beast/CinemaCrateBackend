import { z } from 'zod';

// const { name, mobile, currentPassword, newPassword } = req.body;

export const UpdateProfileSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(3, { message: 'Name should be atleast 3 characters long' })
      .max(50, { message: 'Name should be atmost 50 characters long' }),
    mobile: z
      .number({ required_error: 'Mobile is required' })
      .int({ message: 'Mobile should be an integer' })
      .min(1000000000, {
        message: 'Mobile should be atleast 10 characters long',
      })
      .max(99999999999, {
        message: 'Mobile should be atmost 10 characters long',
      }),
    currentPassword: z
      .string({ required_error: 'Password is required' })
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message:
          'Password should contain atleast one uppercase, one lowercase, one number and one special character',
      })
      .min(8, { message: 'Password should be atleast 8 characters long' })
      .max(50, { message: 'Password should be atmost 50 characters long' })
      .optional(),
    newPassword: z
      .string({ required_error: 'Password is required' })
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message:
          'Password should contain atleast one uppercase, one lowercase, one number and one special character',
      })
      .min(8, { message: 'Password should be atleast 8 characters long' })
      .max(50, { message: 'Password should be atmost 50 characters long' })
      .optional(),
  })
  .strict();

export default UpdateProfileSchema;

type UpdateProfileSchemaType = z.infer<typeof UpdateProfileSchema>;
export { UpdateProfileSchemaType };

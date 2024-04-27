import { z } from 'zod';

export const createContactSchema = z
  .object({
    fName: z
      .string({
        required_error: 'First name is required',
      })
      .min(3, 'First name is too short')
      .max(255, 'First name is too long')
      .regex(/^[a-zA-Z]+$/, 'First name must contain only alphabets')
      .transform((data) => data.trim()),
    lName: z
      .string({
        required_error: 'Last name is required',
      })
      .min(3, 'Last name is too short')
      .max(255, 'Last name is too long')
      .regex(/^[a-zA-Z]+$/, 'Last name must contain only alphabets')
      .transform((data) => data.trim()),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email address')
      .transform((data) => data.trim()),
    mobile: z
      .number({
        required_error: 'Mobile number is required',
      })
      .min(1000000000, 'Invalid mobile number')
      .max(9999999999, 'Invalid mobile number'),
    message: z
      .string({
        required_error: 'Message is required',
      })
      .min(10, 'Message is too short')
      .max(500, 'Message is too long')
      .transform((data) => data.trim()),
  })
  .strict();

export default createContactSchema;

type CreateContactSchemaType = z.infer<typeof createContactSchema>;
export { CreateContactSchemaType };

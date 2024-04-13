import { z } from 'zod';

const generateverificationOTPSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
  })
  .strict();

export default generateverificationOTPSchema;
type GenerateverificationOTPSchemaType = z.infer<
  typeof generateverificationOTPSchema
>;
export { GenerateverificationOTPSchemaType };

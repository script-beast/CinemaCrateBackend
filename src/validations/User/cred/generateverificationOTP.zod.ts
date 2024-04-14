import { z } from 'zod';

const generateVerificationOTPSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
  })
  .strict();

export default generateVerificationOTPSchema;
type GenerateVerificationOTPSchemaType = z.infer<
  typeof generateVerificationOTPSchema
>;
export { GenerateVerificationOTPSchemaType };

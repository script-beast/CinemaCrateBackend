import { z } from 'zod';

const generateResetPassOTPSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
  })
  .strict();

export default generateResetPassOTPSchema;
type GenerateResetPassOTPSchemaType = z.infer<
  typeof generateResetPassOTPSchema
>;
export { GenerateResetPassOTPSchemaType };

import { z } from 'zod';

const refreshTokenSchema = z
  .object({
    refreshToken: z.string({ required_error: 'Refresh Token is required' }),
  })
  .strict();

export default refreshTokenSchema;
type RefreshTokenSchemaType = z.infer<typeof refreshTokenSchema>;
export { RefreshTokenSchemaType };

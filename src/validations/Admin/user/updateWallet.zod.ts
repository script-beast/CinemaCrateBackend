import { z } from 'zod';

const updateWalletSchema = z.object({
  wallet: z.number().int().positive(),
});

export default updateWalletSchema;

type UpdateWalletSchemaType = z.infer<typeof updateWalletSchema>;
export { UpdateWalletSchemaType };

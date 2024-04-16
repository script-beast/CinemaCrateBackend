import mongoose from 'mongoose';
import { z } from 'zod';

const giftCrateSchema = z
  .object({
    userId: z
      .string({ required_error: 'User ID is required' })
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid user ID',
      }),
  })
  .strict();

export default giftCrateSchema;
type GiftCrateSchemaType = z.infer<typeof giftCrateSchema>;
export { GiftCrateSchemaType };

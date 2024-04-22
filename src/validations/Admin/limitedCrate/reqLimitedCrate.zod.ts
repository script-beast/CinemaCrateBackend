import { z } from 'zod';

import reqCrateSchema from '../crate/reqCrate.zod';

// endTime - date time and date time should be greater than current date time,
// discountPrice - number and should be less than price,
// occassion - string and should be less than 255 chars,
// tagLine - string and should be less than 255 chars,

const reqLimitedCrateSchema = reqCrateSchema
  .extend({
    endTime: z
      .string({ required_error: 'EndTime is required' })
      .datetime({
        message: 'Invalid date time format',
      })
      .refine((val) => new Date(val) > new Date(), {
        message: 'EndTime should be greater than current date time',
      }),
    discountPrice: z
      .number({ required_error: 'discountPrice is required' })
      .min(1, { message: 'discountPrice should be greater than 0' }),
    occassion: z
      .string({ required_error: 'Occassion is required' })
      .max(255, { message: 'Occassion should be less than 255 chars' }),
    tagLine: z
      .string({ required_error: 'TagLine is required' })
      .max(255, { message: 'TagLine should be less than 255 chars' }),
  })
  .strict()
  .refine((val) => val.discountPrice < val.price, {
    message: 'DiscountPrice should be less than price',
  });

export default reqLimitedCrateSchema;

type ReqLimitedCrateSchemaType = z.infer<typeof reqLimitedCrateSchema>;
export { ReqLimitedCrateSchemaType };

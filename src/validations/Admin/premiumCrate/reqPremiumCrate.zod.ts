import { z } from 'zod';

import reqCrateSchema from '../crate/reqCrate.zod';

// discount - number and should be greater than 0 and less than 100 its and interger

const reqPremiumCrateSchema = reqCrateSchema
  .omit({ price: true })
  .extend({
    monthlyPrice: z
      .number({ required_error: 'monthlyPrice is required' })
      .min(0, { message: 'monthlyPrice should be greater than 0' })
      .max(1000, { message: 'monthlyPrice should be less than 1000' })
      .transform((val) => parseFloat(val.toFixed(2))),
    yearlyPrice: z
      .number({ required_error: 'yearlyPrice is required' })
      .min(0, { message: 'yearlyPrice should be greater than 0' })
      .max(10000, { message: 'yearlyPrice should be less than 10000' })
      .transform((val) => parseFloat(val.toFixed(2))),
    discount: z
      .number({ required_error: 'discount is required' })
      .int({ message: 'discount should be an integer' })
      .min(0, { message: 'discount should be greater than 0' })
      .max(100, { message: 'discount should be less than 100' }),
  })
  .strict();

export default reqPremiumCrateSchema;
type ReqPremiumCrateSchemaType = z.infer<typeof reqPremiumCrateSchema>;
export { ReqPremiumCrateSchemaType };

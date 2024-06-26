import { z } from 'zod';

const reqCrateSchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }),
    price: z
      .number({ required_error: 'Price is required' })
      .min(1, { message: 'Price should be atleast 1' })
      .max(999, { message: 'Price should be atmost 999' })
      .transform((val) => parseFloat(val.toFixed(2))),
    genre: z.string({ required_error: 'Genre is required' }).toLowerCase(),
    category: z.enum(['movie', 'web-series', 'anime'], {
      required_error: 'Category is required',
      invalid_type_error: 'Invalid category',
    }),
    plot: z.string({ required_error: 'Plot is required' }),
    link: z
      .string({ required_error: 'Link is required' })
      .url({ message: 'Invalid URL' }),
    casts: z
      .array(z.string(), { required_error: 'Casts is required' })
      .min(1, { message: 'Casts should have atleast 1 item' }),
    trailer: z
      .string({ required_error: 'Trailer is required' })
      .url({ message: 'Invalid URL' }),
  })
  .strict();

export default reqCrateSchema;
type ReqCrateSchemaType = z.infer<typeof reqCrateSchema>;
export { ReqCrateSchemaType };

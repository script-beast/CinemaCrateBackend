// const { name, price, credits } = req.body;

import { z } from 'zod';

const reqStoreSchema = z.object({
  name: z.string({ required_error: 'name is required' }),
  price: z.number({ required_error: 'price is required' }),
  credits: z
    .number({ required_error: 'credits is required' })
    .int({ message: 'credits should be an integer' }),
});

export default reqStoreSchema;
type ReqStoreSchemaType = z.infer<typeof reqStoreSchema>;
export { ReqStoreSchemaType };

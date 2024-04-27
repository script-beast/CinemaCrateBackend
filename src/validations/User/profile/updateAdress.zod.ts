import { z } from 'zod';

export const UpdateAddressSchema = z
  .object({
    address: z
      .string({ required_error: 'Address is required' })
      .min(3, { message: 'Address should be atleast 3 characters long' })
      .max(100, { message: 'Address should be atmost 100 characters long' }),
    city: z
      .string({ required_error: 'City is required' })
      .min(3, { message: 'City should be atleast 3 characters long' })
      .max(50, { message: 'City should be atmost 50 characters long' }),
    state: z
      .string({ required_error: 'State is required' })
      .min(3, { message: 'State should be atleast 3 characters long' })
      .max(50, { message: 'State should be atmost 50 characters long' }),
    zip: z
      .number({ required_error: 'Zip is required' })
      .int({ message: 'Zip should be an integer' })
      .min(100000, { message: 'Zip should be atleast 6 characters long' })
      .max(999999, { message: 'Zip should be atmost 6 characters long' }),
    country: z
      .string({ required_error: 'Country is required' })
      .min(3, { message: 'Country should be atleast 3 characters long' })
      .max(50, { message: 'Country should be atmost 50 characters long' }),
    company: z
      .string({ required_error: 'Company is required' })
      .min(3, { message: 'Company should be atleast 3 characters long' })
      .max(50, { message: 'Company should be atmost 50 characters long' }),
  })
  .strict();

export default UpdateAddressSchema;

type UpdateAddressSchemaType = z.infer<typeof UpdateAddressSchema>;
export { UpdateAddressSchemaType };

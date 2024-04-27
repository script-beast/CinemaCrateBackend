import { z } from 'zod';

import { userStatus } from '../../../interfaces/common/user.enum';

// status, remark

const updateStatusSchema = z.object({
  status: z.nativeEnum(userStatus, {
    required_error: 'Category is required',
    invalid_type_error: 'Invalid category',
  }),
  remark: z.string({ required_error: 'Remark is required' }),
});

export default updateStatusSchema;
type UpdateStatusSchemaType = z.infer<typeof updateStatusSchema>;
export { UpdateStatusSchemaType };

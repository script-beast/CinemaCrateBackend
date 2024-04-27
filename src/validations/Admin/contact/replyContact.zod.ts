import { z } from 'zod';

export const replyContactSchema = z.object({
  reply: z.string({
    required_error: 'Reply is required',
  }),
});

export default replyContactSchema;

type ReplyContactSchemaType = z.infer<typeof replyContactSchema>;
export { ReplyContactSchemaType };

import { z } from 'zod'

const getCheckInHistoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
})

export { getCheckInHistoryQuerySchema }

export type GetCheckInHistoryQuerySchemaInput = z.infer<
  typeof getCheckInHistoryQuerySchema
>

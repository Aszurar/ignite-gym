import { z } from 'zod'

const validateCheckInIdParamsSchema = z.object({
  id: z.string().uuid('Invalid check-in to validate'),
})

export { validateCheckInIdParamsSchema }

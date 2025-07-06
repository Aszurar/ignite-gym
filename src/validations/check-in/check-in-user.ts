import { z } from 'zod'

const checkInBodySchema = z.object({
  'user-latitude': z.coerce
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  'user-longitude': z.coerce
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
})

const checkInParamsSchema = z.object({
  gymId: z.string().uuid('Invalid gym ID format'),
})

export { checkInBodySchema, checkInParamsSchema }

import { z } from 'zod'

const nearbyGymBodySchema = z.object({
  userLatitude: z.coerce
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  userLongitude: z.coerce
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
})

const nearbyGymQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
})

export { nearbyGymBodySchema, nearbyGymQuerySchema }

export type NearbyGymBodyInput = z.infer<typeof nearbyGymBodySchema>
export type NearbyGymQueryInput = z.infer<typeof nearbyGymQuerySchema>

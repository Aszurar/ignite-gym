import { z } from 'zod'

const createGymSchema = z.object({
  title: z.string().trim().min(3, 'Title is required'),
  phone: z.string().trim().min(10, 'Phone number is required').optional(),
  description: z.string().trim().min(10, 'Description is required').optional(),
  latitude: z.coerce
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z.coerce
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
})

export { createGymSchema }
export type CreateGymInput = z.infer<typeof createGymSchema>

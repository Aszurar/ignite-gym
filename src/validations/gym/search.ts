import { z } from 'zod'

const searchGymSchema = z.object({
  query: z.string(),
  page: z.coerce.number().min(1).default(1),
})

export { searchGymSchema }

export type SearchGymInput = z.infer<typeof searchGymSchema>

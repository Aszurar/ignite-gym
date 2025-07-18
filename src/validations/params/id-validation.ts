import { z } from 'zod'

const idValidationSchema = z.object({
  sub: z
    .string({
      invalid_type_error: 'ID is invalid',
    })
    .min(1, { message: 'ID is required' }),
})

export { idValidationSchema }

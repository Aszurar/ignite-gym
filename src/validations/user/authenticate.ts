import { z } from 'zod'

const authenticateUserSchema = z.object({
  email: z
    .string({ message: 'Email is invalid.' })
    .email('Invalid email address.'),
  password: z
    .string({ message: 'Password is invalid.' })
    .min(1, 'Password is required.'),
})

export { authenticateUserSchema }
export type AuthenticateUserInput = z.infer<typeof authenticateUserSchema>

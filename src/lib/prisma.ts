import { PrismaClient } from '@prisma/client'

import { env } from '@/env'
import { Environment } from '@/env/utils'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === Environment.DEV ? ['query'] : [],
})

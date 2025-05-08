import { PrismaUserRepository } from '@/Repositories/prisma/prisma-user.repository'

import { AuthenticateUserUseCase } from '../authenticate-user.use-case'

export function makeAuthenticateUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    prismaUserRepository,
  )

  return authenticateUserUseCase
}

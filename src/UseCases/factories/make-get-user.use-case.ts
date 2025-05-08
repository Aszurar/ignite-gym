import { PrismaUserRepository } from '@/Repositories/prisma/prisma-user.repository'

import { GetUserUseCase } from '../get-user.use-case'

export function makeGetUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const getUserUseCase = new GetUserUseCase(prismaUserRepository)

  return getUserUseCase
}

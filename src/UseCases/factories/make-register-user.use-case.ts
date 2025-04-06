import { PrismaUserRepository } from '@/Repositories/prisma/prisma-user.repository'

import { RegisterUserUseCase } from '../register-user.use-case'

export function makeRegisterUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const registerUserUseCase = new RegisterUserUseCase(prismaUserRepository)

  return registerUserUseCase
}

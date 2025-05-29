import { PrismaGymRepository } from '@/Repositories/prisma/prisma-gym.repository'

import { RegisterGymUseCase } from '../register-gym.use-case'

export function makeRegisterGymUseCase() {
  const prismaGymRepository = new PrismaGymRepository()
  const registerGymUseCase = new RegisterGymUseCase(prismaGymRepository)

  return registerGymUseCase
}

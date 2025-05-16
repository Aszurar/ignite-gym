import { PrismaCheckInRepository } from '@/Repositories/prisma/prisma-check-in.repository'
import { PrismaGymRepository } from '@/Repositories/prisma/prisma-gym.repository'

import { CheckInUserUseCase } from '../check-in-user.user-case'

export function makeCheckInUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository()
  const prismaGymRepository = new PrismaGymRepository()

  const makeCheckInUseCase = new CheckInUserUseCase(
    prismaCheckInRepository,
    prismaGymRepository,
  )

  return makeCheckInUseCase
}

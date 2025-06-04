import { PrismaCheckInRepository } from '@/Repositories/prisma/prisma-check-in.repository'

import { ValidateCheckInUserUseCase } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository()
  const validateCheckInUserUseCase = new ValidateCheckInUserUseCase(
    prismaCheckInRepository,
  )

  return validateCheckInUserUseCase
}

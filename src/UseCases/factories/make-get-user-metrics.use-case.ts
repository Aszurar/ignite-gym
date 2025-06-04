import { PrismaCheckInRepository } from '@/Repositories/prisma/prisma-check-in.repository'

import { GetUserMetricsUseCase } from '../get-user-metricts'

export function makeGetUserMetricsUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository()
  const getUserMetricsUseCase = new GetUserMetricsUseCase(
    prismaCheckInRepository,
  )

  return getUserMetricsUseCase
}

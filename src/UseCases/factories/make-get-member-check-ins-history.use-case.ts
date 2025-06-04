import { PrismaCheckInRepository } from '@/Repositories/prisma/prisma-check-in.repository'

import { GetMemberCheckInsHistoryUseCase } from '../get-member-check-ins-history'

export function makeGetMemberCheckInsHistoryUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository()
  const getMemberCheckInsHistoryUseCase = new GetMemberCheckInsHistoryUseCase(
    prismaCheckInRepository,
  )

  return getMemberCheckInsHistoryUseCase
}

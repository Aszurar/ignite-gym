import { PrismaGymRepository } from '@/Repositories/prisma/prisma-gym.repository'

import { GetNearbyGymsUseCase } from '../get-nearby-gyms.use-case'

export function makeGetNearbyGymsUseCase() {
  const prismaGymRepository = new PrismaGymRepository()
  const GgtNearbyGyms = new GetNearbyGymsUseCase(prismaGymRepository)

  return GgtNearbyGyms
}

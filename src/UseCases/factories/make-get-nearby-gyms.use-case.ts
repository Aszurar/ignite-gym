import { PrismaGymRepository } from '@/Repositories/prisma/prisma-gym.repository'

import { GetNearbyGymsUseCase } from '../get-nearby-gyms.use-case'

export function makeGetNearbyGymsUseCase() {
  const prismaGymRepository = new PrismaGymRepository()
  const getNearbyGyms = new GetNearbyGymsUseCase(prismaGymRepository)

  return getNearbyGyms
}

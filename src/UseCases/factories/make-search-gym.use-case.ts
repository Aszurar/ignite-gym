import { PrismaGymRepository } from '@/Repositories/prisma/prisma-gym.repository'

import { SearchGymUseCase } from '../search-gym.use-case'

export function makeSearchGymUseCase() {
  const prismaGymRepository = new PrismaGymRepository()
  const searchGymUseCase = new SearchGymUseCase(prismaGymRepository)

  return searchGymUseCase
}

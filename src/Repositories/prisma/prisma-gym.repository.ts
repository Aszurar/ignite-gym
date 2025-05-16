import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { IGymRepository } from '../interfaces/gym.repository'

class PrismaGymRepository implements IGymRepository {
  async create(data: Prisma.GymUncheckedCreateInput) {
    const gym = await prisma.gym.create({ data })

    return gym
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }
}

export { PrismaGymRepository }

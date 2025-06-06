import { Gym, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import {
  FindManyNearbyParamsType,
  IGymRepository,
} from '../interfaces/gym.repository'

class PrismaGymRepository implements IGymRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async findManyNearby(
    { latitude, longitude }: FindManyNearbyParamsType,
    page: number,
  ) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
      LIMIT 20 OFFSET ${(page - 1) * 20}
    `

    return gyms
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({ data })

    return gym
  }
}

export { PrismaGymRepository }

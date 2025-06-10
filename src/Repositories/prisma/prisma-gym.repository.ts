import { Gym, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import {
  IFindManyNearbyParamsType,
  IGymRepository,
} from '../interfaces/gym.repository'

const PER_PAGE = 20 // Define a constant for items per page

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
    { latitude, longitude }: IFindManyNearbyParamsType,
    page: number,
  ) {
    const baseQuery = `
    FROM gyms
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
  `

    const [gyms, totalCountResult] = await prisma.$transaction([
      prisma.$queryRaw<Gym[]>`
      SELECT * ${Prisma.raw(baseQuery)}
      LIMIT ${PER_PAGE} OFFSET ${(page - 1) * PER_PAGE}
    `,
      prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count ${Prisma.raw(baseQuery)}
    `,
    ])

    const totalCount = Number(totalCountResult[0].count)
    const totalPages = Math.ceil(totalCount / PER_PAGE)

    return {
      data: {
        gyms,
      },
      meta: {
        page,
        perPage: PER_PAGE,
        totalCount,
        totalPages,
      },
    }
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

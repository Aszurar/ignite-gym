import { CheckIn, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { ICheckInRepository } from '../interfaces/check-in.repository'

class PrismaCheckInRepository implements ICheckInRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })

    return user
  }
  // Search for check-in by userId and date
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const checkIn = prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: new Date(date.setHours(0, 0, 0, 0)), //gte => greater than or equal
          lte: new Date(date.setHours(23, 59, 59, 999)), //lte => less than or equal
        },
      },
    })

    return checkIn
  }
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({ data })

    return checkIn
  }
}

export { PrismaCheckInRepository }

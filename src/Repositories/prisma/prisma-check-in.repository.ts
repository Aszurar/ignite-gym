import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

import { ICheckInRepository } from '../interfaces/check-in.repository'

class PrismaCheckInRepository implements ICheckInRepository {
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({ where: { id } })

    return checkIn
  }
  // Search for check-in by userId and date
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(), //gte => greater than or equal
          lte: endOfTheDay.toDate(), //lte => less than or equal
        },
      },
    })

    return checkIn
  }

  findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkInsByUserPaginated = prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 20, // Limit to 20 check-ins per page
      skip: (page - 1) * 20, // Skip the number of check-ins based on the page number
      // This will skip the first (page - 1) * 20 check-ins
      // E.g.:
      // page 1 will skip 0, => The list will starts from the first check-in
      // page 2 will skip 20, => The list will starts from the 21st check-in
      // page 3 will skip 40, and so on. => The will list starts from the 41st check-in
    })

    return checkInsByUserPaginated
  }
  countByUserId(userId: string): Promise<number> {
    const userCheckInsCount = prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return userCheckInsCount
  }
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({ data })

    return checkIn
  }

  update(checkInValidated: CheckIn) {
    const checkIn = prisma.checkIn.update({
      where: { id: checkInValidated.id },
      data: {
        validate_at: checkInValidated.validate_at,
        updated_at: new Date(),
      },
    })
    return checkIn
  }
}

export { PrismaCheckInRepository }

import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

import { ICheckInRepository } from '../interfaces/check-in.repository'

export class InMemoryCheckInRepository implements ICheckInRepository {
  public checkIns: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkInId = crypto.randomUUID()

    const checkIn = {
      id: checkInId,
      gym_id: data.gym_id,
      user_id: data.user_id,
      validate_at: data.validate_at ? new Date(data.validate_at) : null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.checkIns.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfDate = dayjs(date).startOf('date')
    const endOfDate = dayjs(date).endOf('date')

    // Check if the check-in exists for the user within the same data
    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const isSameUser = checkIn.user_id === userId
      const oldCheckInDate = dayjs(checkIn.created_at)

      const isOnSameDate =
        oldCheckInDate.isAfter(startOfDate) &&
        oldCheckInDate.isBefore(endOfDate)

      return isSameUser && isOnSameDate
    })

    return checkInOnSameDate || null
  }
}

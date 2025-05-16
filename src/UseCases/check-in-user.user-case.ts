import { CheckIn } from '@prisma/client'

import { ICheckInRepository } from '@/Repositories/interfaces/check-in.repository'
import { IGymRepository } from '@/Repositories/interfaces/gym.repository'
import {
  getDistanceBetweenCoordinates,
  MAX_DISTANCE_IN_KILOMETERS,
} from '@/utils/distance'

import { InvalidDistanceBetweenUserAndGym } from './errors/invalid-distance-between-user-and-gym'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ICheckInUseCaseRequest {
  gymId: string
  userId: string
  userLatitude: number
  userLongitude: number
}

interface ICheckInUseCaseResponse {
  checkIn: CheckIn
}

class CheckInUserUseCase {
  private readonly checkInRepository: ICheckInRepository
  private readonly gymRepository: IGymRepository

  constructor(
    checkInRepository: ICheckInRepository,
    gymRepository: IGymRepository,
  ) {
    this.checkInRepository = checkInRepository
    this.gymRepository = gymRepository
  }

  async execute(
    data: ICheckInUseCaseRequest,
  ): Promise<ICheckInUseCaseResponse> {
    const { gymId, userId, userLatitude, userLongitude } = data

    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()
    }

    const distanceBetweenGymAndUser = getDistanceBetweenCoordinates({
      from: {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      to: {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    })

    if (distanceBetweenGymAndUser > MAX_DISTANCE_IN_KILOMETERS) {
      throw new InvalidDistanceBetweenUserAndGym()
    }

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}

export { CheckInUserUseCase }

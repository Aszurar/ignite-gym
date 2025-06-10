import { Gym } from '@prisma/client'

import { IGymRepository } from '@/Repositories/interfaces/gym.repository'
import { IMeta } from '@/utils/meta'

interface IGetNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
  page: number
}

interface IGetNearbyGymsUseCaseResponse {
  data: {
    gyms: Gym[]
  }
  meta: IMeta
}

class GetNearbyGymsUseCase {
  private readonly gymRepository: IGymRepository

  constructor(gymRepository: IGymRepository) {
    this.gymRepository = gymRepository
  }

  async execute({
    userLatitude,
    userLongitude,
    page,
  }: IGetNearbyGymsUseCaseRequest): Promise<IGetNearbyGymsUseCaseResponse> {
    const { data, meta } = await this.gymRepository.findManyNearby(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      page,
    )

    return {
      data,
      meta,
    }
  }
}

export { GetNearbyGymsUseCase }

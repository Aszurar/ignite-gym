import { Gym } from '@prisma/client'

import { IGymRepository } from '@/Repositories/interfaces/gym.repository'

interface IGetNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
  page: number
}

interface IGetNearbyGymsUseCaseResponse {
  gyms: Gym[]
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
    const gyms = await this.gymRepository.findManyNearby(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      page,
    )

    return {
      gyms,
    }
  }
}

export { GetNearbyGymsUseCase }

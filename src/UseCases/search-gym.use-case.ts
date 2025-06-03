import { Gym } from '@prisma/client'

import { IGymRepository } from '@/Repositories/interfaces/gym.repository'

interface ISearchGymUseCaseRequest {
  query: string
  page: number
}

interface ISearchGymUseCaseResponse {
  gyms: Gym[]
}

class SearchGymUseCase {
  private readonly gymRepository: IGymRepository

  constructor(gymRepository: IGymRepository) {
    this.gymRepository = gymRepository
  }

  async execute({
    query,
    page = 1,
  }: ISearchGymUseCaseRequest): Promise<ISearchGymUseCaseResponse> {
    const gyms = await this.gymRepository.searchMany(query, page)

    return {
      gyms,
    }
  }
}

export { SearchGymUseCase }

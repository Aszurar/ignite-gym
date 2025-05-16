import { Gym } from '@prisma/client'

import { IGymRepository } from '@/Repositories/interfaces/gym.repository'

interface IGymUseCaseRequest {
  title: string
  description: string
  phone: string
  latitude: number
  longitude: number
}

interface IGymUseCaseResponse {
  gym: Gym
}

export class RegisterGymUseCase {
  private readonly gymRepository: IGymRepository
  constructor(gymRepository: IGymRepository) {
    this.gymRepository = gymRepository
  }

  async execute(data: IGymUseCaseRequest): Promise<IGymUseCaseResponse> {
    const gym = await this.gymRepository.create(data)

    return {
      gym,
    }
  }
}

import { ICheckInRepository } from '@/Repositories/interfaces/check-in.repository'

interface IGetUserMetricsUseCaseRequest {
  userId: string
}

interface IGetUserMetricsUseCaseResponse {
  checkInsCount: number
}

class GetUserMetricsUseCase {
  private readonly checkInRepository: ICheckInRepository

  constructor(checkInRepository: ICheckInRepository) {
    this.checkInRepository = checkInRepository
  }

  async execute({
    userId,
  }: IGetUserMetricsUseCaseRequest): Promise<IGetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}

export { GetUserMetricsUseCase }

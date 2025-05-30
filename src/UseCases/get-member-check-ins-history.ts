import { CheckIn } from '@prisma/client'

import { ICheckInRepository } from '@/Repositories/interfaces/check-in.repository'

interface IGetMemberCheckInsHistoryUseCaseRequest {
  userId: string
  page?: number
}

interface IGetMemberCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

class GetMemberCheckInsHistoryUseCase {
  private readonly checkInRepository: ICheckInRepository

  constructor(checkInRepository: ICheckInRepository) {
    this.checkInRepository = checkInRepository
  }

  async execute({
    userId,
    page = 1,
  }: IGetMemberCheckInsHistoryUseCaseRequest): Promise<IGetMemberCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(userId, page)

    return {
      checkIns,
    }
  }
}

export { GetMemberCheckInsHistoryUseCase }

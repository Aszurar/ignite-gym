import { CheckIn } from '@prisma/client'

import { ICheckInRepository } from '@/Repositories/interfaces/check-in.repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface IValidateCheckInUseCaseRequest {
  checkInId: string
}

interface IValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

class ValidateCheckInUserUseCase {
  private readonly checkInRepository: ICheckInRepository

  constructor(checkInRepository: ICheckInRepository) {
    this.checkInRepository = checkInRepository
  }

  async execute({
    checkInId,
  }: IValidateCheckInUseCaseRequest): Promise<IValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validate_at = new Date()

    const validatedCheckIn = await this.checkInRepository.update(checkIn)

    return {
      checkIn: validatedCheckIn,
    }
  }
}

export { ValidateCheckInUserUseCase }

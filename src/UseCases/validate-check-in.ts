import { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'

import { ICheckInRepository } from '@/Repositories/interfaces/check-in.repository'

import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
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

    const currentDate = new Date()

    const distanceBetweenInMinutesFromCheckInCreation = dayjs(currentDate).diff(
      dayjs(checkIn.created_at),
      'minute',
    )

    const twentyMinutes = 20

    if (distanceBetweenInMinutesFromCheckInCreation > twentyMinutes) {
      throw new LateCheckInValidationError()
    }

    checkIn.validate_at = currentDate

    const validatedCheckIn = await this.checkInRepository.update(checkIn)

    return {
      checkIn: validatedCheckIn,
    }
  }
}

export { ValidateCheckInUserUseCase }

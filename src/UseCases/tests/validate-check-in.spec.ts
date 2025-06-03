import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInRepository } from '@/Repositories/InMemory/in-memory-check-in-user.repository'

import { LateCheckInValidationError } from '../errors/late-check-in-validation-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ValidateCheckInUserUseCase } from '../validate-check-in'

let inMemoryCheckInRepository: InMemoryCheckInRepository
let validateCheckInUseCase: ValidateCheckInUserUseCase

describe('Validate check-in  Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository()
    validateCheckInUseCase = new ValidateCheckInUserUseCase(
      inMemoryCheckInRepository,
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate a check-in', async () => {
    const checkIn = await inMemoryCheckInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn: checkInValidated } = await validateCheckInUseCase.execute({
      checkInId: checkIn.id,
    })

    expect(checkInValidated.validate_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toThrow(ResourceNotFoundError)
  })

  it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
    const data = new Date(2025, 5, 8, 12, 0, 0) // Data fixa: 8/6/2025 - 12:00:00
    vi.setSystemTime(data)

    const checkIn = await inMemoryCheckInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMilliseconds = 21 * 60 * 1000

    vi.advanceTimersByTime(twentyOneMinutesInMilliseconds) // Avança o tempo em 21 minutos

    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: checkIn.id,
      }),
    ).rejects.toThrow(LateCheckInValidationError)
  })
})

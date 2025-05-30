import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInRepository } from '@/Repositories/InMemory/in-memory-check-in-user.repository'

import { GetUserMetricsUseCase } from '../get-user-metricts'
let inMemoryCheckInRepository: InMemoryCheckInRepository
let getUserMetricsUseCase: GetUserMetricsUseCase

describe('Get user metrics Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository()
    getUserMetricsUseCase = new GetUserMetricsUseCase(inMemoryCheckInRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await inMemoryCheckInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await inMemoryCheckInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })
    await inMemoryCheckInRepository.create({
      gym_id: 'gym-03',
      user_id: 'user-01',
    })

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(3)
  })
  it('should not be able to list check-in count for an non-existing user', async () => {
    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: 'non-existing-user',
    })

    expect(checkInsCount).toEqual(0)
  })
})

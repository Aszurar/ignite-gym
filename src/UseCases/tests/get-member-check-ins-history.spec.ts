import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInRepository } from '@/Repositories/InMemory/in-memory-check-in-user.repository'

import { GetMemberCheckInsHistoryUseCase } from '../get-member-check-ins-history'

let inMemoryCheckInRepository: InMemoryCheckInRepository
let memberCheckInsHistoryUseCase: GetMemberCheckInsHistoryUseCase

describe('Get check ins user history Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository()
    memberCheckInsHistoryUseCase = new GetMemberCheckInsHistoryUseCase(
      inMemoryCheckInRepository,
    )
  })

  it('should be able to list check-in history', async () => {
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

    const { checkIns } = await memberCheckInsHistoryUseCase.execute({
      userId: 'user-01',
    })

    expect(checkIns).toHaveLength(3)
    expect(checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ gym_id: 'gym-01' }),
        expect.objectContaining({ gym_id: 'gym-02' }),
        expect.objectContaining({ gym_id: 'gym-03' }),
      ]),
    )
  })
  it('should not be able to list check-in history for an non-existing user', async () => {
    const { checkIns } = await memberCheckInsHistoryUseCase.execute({
      userId: 'non-existing-user',
    })

    expect(checkIns).toHaveLength(0)
  })
})

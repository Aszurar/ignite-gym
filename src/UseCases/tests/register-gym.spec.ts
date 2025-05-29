import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymRepository } from '@/Repositories/InMemory/in-memory-gym.repository'

import { RegisterGymUseCase } from '../register-gym.use-case'

let inMemoryGymRepository: InMemoryGymRepository
let registerGymUseCase: RegisterGymUseCase

const gymCoordinates = {
  latitude: -7.074025689553661,
  longitude: -34.833931788459715,
}

describe('Register Gym Use Case', () => {
  beforeEach(() => {
    inMemoryGymRepository = new InMemoryGymRepository()
    registerGymUseCase = new RegisterGymUseCase(inMemoryGymRepository)
  })

  it('should be able to register a gym', async () => {
    const { gym } = await registerGymUseCase.execute({
      description: 'A great gym',
      title: 'Gym A',
      phone: '123456789',
      latitude: gymCoordinates.latitude,
      longitude: gymCoordinates.longitude,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})

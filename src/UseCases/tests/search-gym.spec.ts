import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymRepository } from '@/Repositories/InMemory/in-memory-gym.repository'

import { SearchGymUseCase } from '../search-gym.use-case'

let inMemoryGymRepository: InMemoryGymRepository
let searchGymUseCase: SearchGymUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    inMemoryGymRepository = new InMemoryGymRepository()
    searchGymUseCase = new SearchGymUseCase(inMemoryGymRepository)
  })

  it('should be able to search for gyms ', async () => {
    await inMemoryGymRepository.create({
      title: 'JavaScript',
      description: 'Description JavaScript',
      phone: '123456789',
      latitude: -7.074025689553661,
      longitude: -34.833931788459715,
    })
    await inMemoryGymRepository.create({
      title: 'TypeScript',
      description: 'Description TypeScript',
      phone: '123456789',
      latitude: -7.074025689553661,
      longitude: -34.833931788459715,
    })

    const { gyms } = await searchGymUseCase.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'JavaScript' }),
      ]),
    )
  })
  it('should be able to return an empty list if the search parameters do not match any gyms', async () => {
    const { gyms } = await searchGymUseCase.execute({
      query: 'non-existing-user',
      page: 1,
    })

    expect(gyms).toHaveLength(0)
  })

  it('should be able to search gym  with pagination', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryGymRepository.create({
        title: `Gym-${i}`,
        description: `Description Gym ${i}`,
        phone: '123456789',
        latitude: -7.074025689553661,
        longitude: -34.833931788459715,
      })
    }

    const { gyms } = await searchGymUseCase.execute({
      query: 'Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Gym-21' }),
        expect.objectContaining({ title: 'Gym-22' }),
      ]),
    )
  })
})

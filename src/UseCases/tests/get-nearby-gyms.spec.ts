import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymRepository } from '@/Repositories/InMemory/in-memory-gym.repository'

import { GetNearbyGymUseCase } from '../get-nearby-gyms.use-case'

let inMemoryGymRepository: InMemoryGymRepository
let getNearbyUseCase: GetNearbyGymUseCase

const nearbyGymsCoordinates = {
  latitude: -7.074025689553661,
  longitude: -34.833931788459715,
}

const userCoordinates = {
  latitude: -7.07415877911633,
  longitude: -34.8337735381304,
}

const farAwayGymsCoordinates = {
  latitude: -7.249423133115058, // 40km de distância
  longitude: -35.20936549185303, // 40km de distância
}

describe('Get Nearby Gym Use Case', () => {
  beforeEach(async () => {
    inMemoryGymRepository = new InMemoryGymRepository()
    getNearbyUseCase = new GetNearbyGymUseCase(inMemoryGymRepository)
  })

  it('should be able to search for gyms ', async () => {
    await inMemoryGymRepository.create({
      title: 'JavaScript',
      description: 'Description JavaScript',
      phone: '123456789',
      latitude: nearbyGymsCoordinates.latitude,
      longitude: nearbyGymsCoordinates.longitude,
    })
    await inMemoryGymRepository.create({
      title: 'TypeScript',
      description: 'Description TypeScript',
      phone: '123456789',
      latitude: farAwayGymsCoordinates.latitude, // 40km de distância
      longitude: farAwayGymsCoordinates.longitude, // 40km de distância
    })
    const { gyms } = await getNearbyUseCase.execute({
      userLatitude: userCoordinates.latitude,
      userLongitude: userCoordinates.longitude,
      page: 1,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'JavaScript' }),
      ]),
    )
  })

  it('should be able to get nearby gyms with pagination', async () => {
    for (let i = 1; i <= 20; i++) {
      await inMemoryGymRepository.create({
        title: `Gym-${i}`,
        description: `Description Gym ${i}`,
        phone: '123456789',
        latitude: farAwayGymsCoordinates.latitude,
        longitude: farAwayGymsCoordinates.longitude,
      })
    }

    inMemoryGymRepository.create({
      title: 'Gym-21',
      description: 'Description Gym 21',
      phone: '123456789',
      latitude: nearbyGymsCoordinates.latitude,
      longitude: nearbyGymsCoordinates.longitude,
    })
    inMemoryGymRepository.create({
      title: 'Gym-22',
      description: 'Description Gym 22',
      phone: '123456789',
      latitude: nearbyGymsCoordinates.latitude,
      longitude: nearbyGymsCoordinates.longitude,
    })

    const { gyms } = await getNearbyUseCase.execute({
      userLatitude: userCoordinates.latitude,
      userLongitude: userCoordinates.longitude,
      page: 1,
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

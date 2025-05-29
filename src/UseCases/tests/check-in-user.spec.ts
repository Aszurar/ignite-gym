import { Gym } from '@prisma/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInRepository } from '@/Repositories/InMemory/in-memory-check-in-user.repository'
import { InMemoryGymRepository } from '@/Repositories/InMemory/in-memory-gym.repository'

import { CheckInUserUseCase } from '../check-in-user.user-case'
import { MaxNumberOfCheckInsError } from '../errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { RegisterGymUseCase } from '../register-gym.use-case'

// check-in
let inMemoryCheckInRepository: InMemoryCheckInRepository
let checkInUserUseCase: CheckInUserUseCase
// gym
let inMemoryGymRepository: InMemoryGymRepository
let gymUseCase: RegisterGymUseCase

let inMemoryGym: Gym

const gymCoordinates = {
  latitude: -7.074025689553661,
  longitude: -34.833931788459715,
}

const userValidCoordinates = {
  latitude: -7.07415877911633,
  longitude: -34.8337735381304,
}

const userInvalidCoordinates = {
  latitude: -7.075103391954287,
  longitude: -34.832730160753016,
}
describe('CheckIn User Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository()
    inMemoryGymRepository = new InMemoryGymRepository()

    checkInUserUseCase = new CheckInUserUseCase(
      inMemoryCheckInRepository,
      inMemoryGymRepository,
    )

    gymUseCase = new RegisterGymUseCase(inMemoryGymRepository)

    const { gym } = await gymUseCase.execute({
      title: 'gym-01',
      description: 'Gym 01 description',
      phone: '11999999999',
      latitude: gymCoordinates.latitude,
      longitude: gymCoordinates.longitude,
    })

    inMemoryGym = gym

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in a user', async () => {
    const { checkIn } = await checkInUserUseCase.execute({
      gymId: inMemoryGym.id,
      userId: 'user-01',
      userLatitude: userValidCoordinates.latitude,
      userLongitude: userValidCoordinates.longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in a user twice', async () => {
    const data = new Date(2025, 5, 8, 12, 0, 0)
    vi.setSystemTime(data)

    await checkInUserUseCase.execute({
      gymId: inMemoryGym.id,
      userId: 'user-01',
      userLatitude: userValidCoordinates.latitude,
      userLongitude: userValidCoordinates.longitude,
    })
    await expect(() =>
      checkInUserUseCase.execute({
        gymId: inMemoryGym.id,
        userId: 'user-01',
        userLatitude: userValidCoordinates.latitude,
        userLongitude: userValidCoordinates.longitude,
      }),
    ).rejects.toThrow(MaxNumberOfCheckInsError)
  })

  it('should be able to check in a user in different days', async () => {
    const data = new Date(2025, 5, 8, 12, 0, 0)
    vi.setSystemTime(data)

    const { checkIn: oldCheckIn } = await checkInUserUseCase.execute({
      gymId: inMemoryGym.id,
      userId: 'user-01',
      userLatitude: userValidCoordinates.latitude,
      userLongitude: userValidCoordinates.longitude,
    })

    const otherDate = new Date(2025, 5, 12, 13, 0, 0)
    vi.setSystemTime(otherDate)

    const { checkIn } = await checkInUserUseCase.execute({
      gymId: inMemoryGym.id,
      userId: 'user-01',
      userLatitude: userValidCoordinates.latitude,
      userLongitude: userValidCoordinates.longitude,
    })

    expect(oldCheckIn.id).not.toEqual(checkIn.id)
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym(>100m)', async () => {
    await expect(() =>
      checkInUserUseCase.execute({
        gymId: inMemoryGym.id,
        userId: 'user-01',
        userLatitude: userInvalidCoordinates.latitude,
        userLongitude: userInvalidCoordinates.longitude,
      }),
    ).rejects.toThrow(Error)
  })

  it('should not be able to check in to an unregistered gym', async () => {
    await expect(() =>
      checkInUserUseCase.execute({
        gymId: '123213312',
        userId: 'user-01',
        userLatitude: userInvalidCoordinates.latitude,
        userLongitude: userInvalidCoordinates.longitude,
      }),
    ).rejects.toThrow(ResourceNotFoundError)
  })
})

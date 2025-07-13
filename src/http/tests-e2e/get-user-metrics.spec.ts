import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { STATUS_INFO } from '@/constants'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

const gymCoordinates = {
  latitude: -7.074025689553661,
  longitude: -34.833931788459715,
}

const gymBCoordinates = {
  latitude: -17.074025689553661,
  longitude: -44.833931788459715,
}

describe('Get user metrics E2E Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to get user metrics E2E Tests', async () => {
    const accessToken = await createAndAuthenticateUser(app)
    // register gyms
    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Gym A',
        description: 'Gym A Description',
        phone: '123456789',
        latitude: gymCoordinates.latitude,
        longitude: gymCoordinates.longitude,
      },
    })

    const gymB = await prisma.gym.create({
      data: {
        title: 'Gym B',
        description: 'Gym B Description',
        phone: '987654321',
        latitude: gymBCoordinates.latitude,
        longitude: gymBCoordinates.longitude,
      },
    })

    await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gym_id: gym.id,
      },
    })
    await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gym_id: gymB.id,
      },
    })

    const response = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.error).toBe(false)
    expect(response.statusCode).toBe(STATUS_INFO.OK.code)
    expect(response.body.data.checkInsCount).toEqual(1)
  })
})

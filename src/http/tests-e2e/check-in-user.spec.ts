import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { STATUS_INFO } from '@/constants'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

const userCoordinates = {
  latitude: -7.07415877911633,
  longitude: -34.8337735381304,
}

const gymCoordinates = {
  latitude: -7.074025689553661,
  longitude: -34.833931788459715,
}

describe('Search Gyms E2E Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should check in user', async () => {
    const accessToken = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Gym A',
        description: 'Gym A description',
        phone: '11999999999',
        latitude: gymCoordinates.latitude,
        longitude: gymCoordinates.longitude,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-in`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        'user-latitude': userCoordinates.latitude,
        'user-longitude': userCoordinates.longitude,
      })

    expect(response.error).toBe(false)
    expect(response.statusCode).toBe(STATUS_INFO.CREATED.code)
  })
})

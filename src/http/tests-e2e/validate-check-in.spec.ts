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

describe('Validate check-in E2E Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to validate a check-in E2E Tests', async () => {
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

    const checkIn = await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gym_id: gym.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    const checkInUpdated = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })
    expect(response.error).toBe(false)
    expect(response.statusCode).toBe(STATUS_INFO.NO_CONTENT.code)
    expect(checkInUpdated.validate_at).toEqual(expect.any(Date))
  })
})

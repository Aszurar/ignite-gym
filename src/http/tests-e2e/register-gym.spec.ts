import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { STATUS_INFO } from '@/constants'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

const gymCoordinates = {
  latitude: -7.074025689553661,
  longitude: -34.833931788459715,
}

describe('Register Gym E2E Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should register a new gym successfully', async () => {
    const accessToken = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gym')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Gym A',
        description: 'A great gym for fitness enthusiasts',
        phone: '1234567890',
        latitude: gymCoordinates.latitude,
        longitude: gymCoordinates.longitude,
      })

    expect(response.error).toBe(false)
    expect(response.statusCode).toBe(STATUS_INFO.CREATED.code)
  })
})

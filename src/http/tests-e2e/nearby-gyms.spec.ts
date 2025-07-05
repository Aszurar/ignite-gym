import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { STATUS_INFO } from '@/constants'
import { registerGym } from '@/utils/tests/register-gym'

const userCoordinates = {
  latitude: -7.07415877911633,
  longitude: -34.8337735381304,
}
describe('List nearby Gyms E2E Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should get nearby gyms', async () => {
    const { accessToken, gyms } = await registerGym(app)

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        'user-latitude': userCoordinates.latitude,
        'user-longitude': userCoordinates.longitude,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.error).toBe(false)
    expect(response.statusCode).toBe(STATUS_INFO.OK.code)
    expect(response.body.data.data.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: gyms.gymA.title }),
      ]),
    )
  })
})

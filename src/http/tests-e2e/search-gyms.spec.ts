import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { STATUS_INFO } from '@/constants'
import { registerGym } from '@/utils/tests/register-gym'

describe('Search Gyms E2E Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should search gyms', async () => {
    const { accessToken, gyms } = await registerGym(app)

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: gyms.gymA.title,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.error).toBe(false)
    expect(response.statusCode).toBe(STATUS_INFO.OK.code)
    expect(response.body.data.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: gyms.gymA.title }),
      ]),
    )
  })
})

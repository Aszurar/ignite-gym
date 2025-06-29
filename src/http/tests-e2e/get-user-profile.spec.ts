import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { STATUS_INFO } from '@/constants'

describe('Get user profile E2E Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should get user profile data', async () => {
    // register a user
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'John.1234',
      confirmPassword: 'John.1234',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@email.com',
      password: 'John.1234',
    })

    const accessToken = authResponse.body.token

    // get user profile data
    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(authResponse.body).toEqual({
      token: expect.any(String),
    })
    expect(profileResponse.error).toBe(false)
    expect(profileResponse.statusCode).toBe(STATUS_INFO.OK.code)
    expect(profileResponse.body.data.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@email.com',
      }),
    )
  })
})

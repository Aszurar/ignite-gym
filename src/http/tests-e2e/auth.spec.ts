import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { STATUS_INFO } from '@/constants'

describe('Auth User E2E Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.skip('should authenticate a user successfully', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'John.1234',
      confirmPassword: 'John.1234',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@email.com',
      password: 'John.1234',
    })

    expect(response.error).toBe(false)
    expect(response.statusCode).toBe(STATUS_INFO.OK.code)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})

import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
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

  return accessToken
}

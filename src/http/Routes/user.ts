import { FastifyInstance } from 'fastify'

import { RegisterUserController } from '../Controllers/register-user.controller'

export async function userRoutes(app: FastifyInstance) {
  const registerUserController = new RegisterUserController()

  app.post('/users', registerUserController.handle)
}

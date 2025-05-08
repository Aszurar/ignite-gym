import { FastifyInstance } from 'fastify'

import { AuthenticateUserController } from '../Controllers/authenticate-user.controller'
import { GetUserController } from '../Controllers/get-user.controller'
import { RegisterUserController } from '../Controllers/register-user.controller'

export async function userRoutes(app: FastifyInstance) {
  const registerUserController = new RegisterUserController()
  const authenticateUserController = new AuthenticateUserController()
  const getUserController = new GetUserController()

  app.post('/users', registerUserController.handle)

  app.post('/sessions', authenticateUserController.handle)

  app.get('/users/:id', getUserController.handler)
}

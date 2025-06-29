import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/middleware/verify-jwt'

import { AuthenticateUserController } from '../Controllers/users/authenticate-user.controller'
import { GetUserController } from '../Controllers/users/get-user.controller'
import { RegisterUserController } from '../Controllers/users/register-user.controller'

export async function userRoutes(app: FastifyInstance) {
  const registerUserController = new RegisterUserController()
  const authenticateUserController = new AuthenticateUserController()
  const getUserController = new GetUserController()

  app.post('/users', registerUserController.handle)

  app.post('/sessions', authenticateUserController.handle)

  // User needs to be authenticated to access this route
  app.get('/me', { onRequest: [verifyJwt] }, getUserController.handler)
}

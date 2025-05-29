import { FastifyInstance } from 'fastify'

import { RegisterGymController } from '../Controllers/register-gym.controller'

export async function gymRoutes(app: FastifyInstance) {
  const registerGymController = new RegisterGymController()

  app.post('/gym', registerGymController.handle)
}

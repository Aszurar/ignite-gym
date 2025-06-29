import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/middleware/verify-jwt'

import { NearbyGymController } from '../Controllers/gyms/nearby-gym.controller'
import { RegisterGymController } from '../Controllers/gyms/register-gym.controller'
import { SearchGymController } from '../Controllers/gyms/search-gym.controller'

export async function gymRoutes(app: FastifyInstance) {
  const registerGymController = new RegisterGymController()
  const searchGymsController = new SearchGymController()
  const nearbyGymsController = new NearbyGymController()

  // Add JWT verification middleware to all gyms routes
  app.addHook('onRequest', verifyJwt)

  app.post('/gym', registerGymController.handle)
  app.get('/gyms/search', searchGymsController.handle)
  app.get('/gyms/nearby', nearbyGymsController.handle)
}

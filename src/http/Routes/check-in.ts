import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/middleware/verify-jwt'

import { CheckInUserController } from '../Controllers/check-in/check-in-user.controller'
import { GetCheckInHistoryController } from '../Controllers/check-in/get-check-in-history.controller'
import { GetUserMetricsController } from '../Controllers/check-in/get-user-metricts.controller'

export async function checkInRoutes(app: FastifyInstance) {
  const checkInUserController = new CheckInUserController()
  const getCheckInHistoryController = new GetCheckInHistoryController()
  const getUserMetricsController = new GetUserMetricsController()

  // Add JWT verification middleware to all gyms routes
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms/:gymId/check-in', checkInUserController.handle)
  app.get('/check-ins/history', getCheckInHistoryController.handle)
  app.get('/check-ins/metrics', getUserMetricsController.handle)
}

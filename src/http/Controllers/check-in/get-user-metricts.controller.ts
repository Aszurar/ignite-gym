import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'
import { makeGetUserMetricsUseCase } from '@/UseCases/factories/make-get-user-metrics.use-case'

class GetUserMetricsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const makeGetCheckInHistory = makeGetUserMetricsUseCase()
    const userMetrics = await makeGetCheckInHistory.execute({
      userId: request.user.sub,
    })

    return reply.status(STATUS_INFO.OK.code).send({
      data: userMetrics,
    })
  }
}

export { GetUserMetricsController }

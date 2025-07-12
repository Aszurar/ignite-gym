import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'
import { makeGetMemberCheckInsHistoryUseCase } from '@/UseCases/factories/make-get-member-check-ins-history.use-case'
import { getCheckInHistoryQuerySchema } from '@/validations/check-in/get-check-in-history'

class GetCheckInHistoryController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query

    const queryData = getCheckInHistoryQuerySchema.parse(query)

    const makeGetCheckInHistory = makeGetMemberCheckInsHistoryUseCase()
    const checkIn = await makeGetCheckInHistory.execute({
      userId: request.user.sub,
      page: queryData.page,
    })

    return reply.status(STATUS_INFO.OK.code).send({
      data: checkIn,
    })
  }
}

export { GetCheckInHistoryController }

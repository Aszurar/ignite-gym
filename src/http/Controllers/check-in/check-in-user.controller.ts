import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'
import { makeCheckInUseCase } from '@/UseCases/factories/make-check-in.user-case'
import {
  checkInBodySchema,
  checkInParamsSchema,
} from '@/validations/check-in/check-in-user'

class CheckInUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body
    const params = request.params

    const bodyData = checkInBodySchema.parse(body)
    const paramsData = checkInParamsSchema.parse(params)

    const makeCheckIn = makeCheckInUseCase()
    const checkIn = await makeCheckIn.execute({
      gymId: paramsData.gymId,
      userId: request.user.sub,
      userLatitude: bodyData['user-latitude'],
      userLongitude: bodyData['user-longitude'],
    })

    return reply.status(STATUS_INFO.CREATED.code).send({
      data: checkIn,
    })
  }
}

export { CheckInUserController }

import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'
import { InvalidDistanceBetweenUserAndGym } from '@/UseCases/errors/invalid-distance-between-user-and-gym'
import { MaxNumberOfCheckInsError } from '@/UseCases/errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from '@/UseCases/errors/resource-not-found-error'
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

    try {
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
    } catch (error) {
      if (
        error instanceof ResourceNotFoundError ||
        error instanceof MaxNumberOfCheckInsError ||
        error instanceof InvalidDistanceBetweenUserAndGym
      ) {
        return reply.status(error.code).send({
          statusCode: error.code,
          message: error.message,
        })
      }
      throw error
    }
  }
}

export { CheckInUserController }

import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'
import { LateCheckInValidationError } from '@/UseCases/errors/late-check-in-validation-error'
import { ResourceNotFoundError } from '@/UseCases/errors/resource-not-found-error'
import { makeValidateCheckInUseCase } from '@/UseCases/factories/make-validate-check-in'
import { validateCheckInIdParamsSchema } from '@/validations/check-in/validate-check-in'

class ValidateCheckInController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params
    const paramsValidated = validateCheckInIdParamsSchema.parse(params)
    try {
      const makeValidateCheckIn = makeValidateCheckInUseCase()
      await makeValidateCheckIn.execute({
        checkInId: paramsValidated.id,
      })

      return reply.status(STATUS_INFO.NO_CONTENT.code).send()
    } catch (error) {
      if (
        error instanceof ResourceNotFoundError ||
        error instanceof LateCheckInValidationError
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

export { ValidateCheckInController }

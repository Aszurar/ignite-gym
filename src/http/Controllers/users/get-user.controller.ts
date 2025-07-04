import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'
import { ResourceNotFoundError } from '@/UseCases/errors/resource-not-found-error'
import { makeGetUserUseCase } from '@/UseCases/factories/make-get-user.use-case'
import { idValidationSchema } from '@/validations/params/id-validation'

class GetUserController {
  async handler(request: FastifyRequest, reply: FastifyReply) {
    const dataValidated = idValidationSchema.parse(request.user)
    try {
      const getUserUseCase = makeGetUserUseCase()
      const user = await getUserUseCase.execute({ userId: dataValidated.sub })

      return reply.status(STATUS_INFO.OK.code).send({
        data: user,
      })
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return reply.status(STATUS_INFO.NOT_FOUND.code).send({
          statusCode: error.code,
          message: error.message,
        })
      }
      throw error
    }
  }
}

export { GetUserController }

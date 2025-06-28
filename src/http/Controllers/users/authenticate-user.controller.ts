import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'
import { InvalidCredentialsError } from '@/UseCases/errors/invalid-credentials-error'
import { makeAuthenticateUserUseCase } from '@/UseCases/factories/make-autenticate-user.use-case'
import { authenticateUserSchema } from '@/validations/user/authenticate'

class AuthenticateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body

    const dataValidated = authenticateUserSchema.parse(data)

    try {
      const authenticateUserUseCase = makeAuthenticateUserUseCase()
      const { user } = await authenticateUserUseCase.execute(dataValidated)

      const token = await reply.jwtSign(
        {},
        {
          sub: user.id,
        },
      )

      return reply.status(STATUS_INFO.OK.code).send({
        token,
      })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        // Invalid credentials?
        return reply.status(STATUS_INFO.BAD_REQUEST.code).send({
          statusCode: error.code,
          message: error.message,
        })
      }
      throw error
    }
  }
}

export { AuthenticateUserController }

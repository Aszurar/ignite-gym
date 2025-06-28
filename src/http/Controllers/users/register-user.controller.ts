import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'
import { UserAlreadyExistsError } from '@/UseCases/errors/user-already-exists-error'
import { makeRegisterUserUseCase } from '@/UseCases/factories/make-register-user.use-case'
import { createUserSchema } from '@/validations/user/create'

class RegisterUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body

    const dataValidated = createUserSchema.parse(data)

    try {
      const registerUserUseCase = makeRegisterUserUseCase()
      await registerUserUseCase.execute(dataValidated)
    } catch (error) {
      // User already exists?
      if (error instanceof UserAlreadyExistsError) {
        return reply.status(STATUS_INFO.CONFLICT.code).send({
          statusCode: error.code,
          message: error.message,
        })
      }

      throw error
    }

    return reply.status(STATUS_INFO.CREATED.code).send()
  }
}

export { RegisterUserController }

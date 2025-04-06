import { FastifyReply, FastifyRequest } from 'fastify'

import { UserAlreadyExistsError } from '@/UseCases/errors/user-already-exists-error'
import { makeRegisterUserUseCase } from '@/UseCases/factories/make-register-user.use-case'
import { createUserSchema } from '@/validations/user/create'

class RegisterUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body

    const dataValidated = createUserSchema.parse(data)

    try {
      const registerUserUseCase = makeRegisterUserUseCase()
      registerUserUseCase.execute(dataValidated)
    } catch (error) {
      // User already exists?
      if (error instanceof UserAlreadyExistsError) {
        return reply.status(409).send({
          message: error.message,
        })
      }

      throw error
    }

    return reply.status(201).send()
  }
}

export { RegisterUserController }

import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'
import { makeRegisterGymUseCase } from '@/UseCases/factories/make-register-gym.use-case'
import { createGymSchema } from '@/validations/gym/create'

class RegisterGymController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body

    const dataValidated = createGymSchema.parse(data)

    const registerGymUseCase = makeRegisterGymUseCase()
    await registerGymUseCase.execute(dataValidated)

    return reply.status(STATUS_INFO.CREATED.code).send()
  }
}

export { RegisterGymController }

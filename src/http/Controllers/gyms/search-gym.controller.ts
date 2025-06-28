import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'
import { makeSearchGymUseCase } from '@/UseCases/factories/make-search-gym.use-case'
import { searchGymSchema } from '@/validations/gym/search'

class SearchGymController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = request.query

    const dataValidated = searchGymSchema.parse(data)

    const searchGymUseCase = makeSearchGymUseCase()
    const gyms = await searchGymUseCase.execute(dataValidated)

    return reply.status(STATUS_INFO.OK.code).send({
      data: gyms,
      page: dataValidated.page,
    })
  }
}

export { SearchGymController }

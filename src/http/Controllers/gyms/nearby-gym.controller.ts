import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'
import { makeGetNearbyGymsUseCase } from '@/UseCases/factories/make-get-nearby-gyms.use-case'
import {
  nearbyGymBodySchema,
  nearbyGymQuerySchema,
} from '@/validations/gym/nearby'

class NearbyGymController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body
    const query = request.query

    const bodyData = nearbyGymBodySchema.parse(data)
    const queryData = nearbyGymQuerySchema.parse(query)

    const nearbyGymUseCase = makeGetNearbyGymsUseCase()
    const nearbyGyms = await nearbyGymUseCase.execute({
      userLatitude: bodyData.userLatitude,
      userLongitude: bodyData.userLongitude,
      page: queryData.page,
    })

    return reply.status(STATUS_INFO.OK.code).send({
      data: nearbyGyms,
    })
  }
}

export { NearbyGymController }

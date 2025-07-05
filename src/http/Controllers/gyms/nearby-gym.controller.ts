import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'
import { makeGetNearbyGymsUseCase } from '@/UseCases/factories/make-get-nearby-gyms.use-case'
import { nearbyGymQuerySchema } from '@/validations/gym/nearby'

class NearbyGymController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query

    const queryData = nearbyGymQuerySchema.parse(query)

    console.log('NearbyGymController', {
      userLatitude: queryData['user-latitude'],
      userLongitude: queryData['user-longitude'],
      page: queryData.page,
    })

    const nearbyGymUseCase = makeGetNearbyGymsUseCase()
    const nearbyGyms = await nearbyGymUseCase.execute({
      userLatitude: queryData['user-latitude'],
      userLongitude: queryData['user-longitude'],
      page: queryData.page,
    })

    return reply.status(STATUS_INFO.OK.code).send({
      data: nearbyGyms,
    })
  }
}

export { NearbyGymController }

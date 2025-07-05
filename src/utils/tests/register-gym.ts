import { FastifyInstance } from 'fastify'
import request from 'supertest'

import { createAndAuthenticateUser } from './create-and-authenticate-user'

const gymACoordinates = {
  latitude: -7.074025689553661,
  longitude: -34.833931788459715,
}

const gymBCoordinates = {
  latitude: -8.074025689553661,
  longitude: -44.833931788459715,
}

export async function registerGym(app: FastifyInstance) {
  const accessToken = await createAndAuthenticateUser(app)

  await request(app.server)
    .post('/gym')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      title: 'Gym A',
      description: 'A great gym for fitness enthusiasts',
      phone: '1234567890',
      latitude: gymACoordinates.latitude,
      longitude: gymACoordinates.longitude,
    })

  await request(app.server)
    .post('/gym')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      title: 'Gym B',
      description: 'Gym B is a great place to work out',
      phone: '2885578809',
      latitude: gymBCoordinates.latitude,
      longitude: gymBCoordinates.longitude,
    })

  return {
    accessToken,
    gyms: {
      gymA: {
        title: 'Gym A',
      },
      gymB: {
        title: 'Gym B',
      },
    },
  }
}

import { FastifyInstance } from 'fastify'

import { prisma } from '@/lib/prisma'
import { createUserSchema } from '@/validationts/user/create'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const data = request.body

    if (!data) {
      return reply.status(400).send({
        message: 'Invalid data, please, filled correctly',
        errors: { body: ['Body is required'] },
      })
    }

    const dataValidated = createUserSchema.safeParse(data)

    if (!dataValidated.success) {
      console.log(JSON.stringify(dataValidated.error.flatten().fieldErrors))
      return reply.status(400).send({
        message: 'Invalid data, please, filled correctly',
        errors: dataValidated.error.flatten().fieldErrors,
      })
    }
    const { name, email, password } = dataValidated.data

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password_hash: password,
      },
    })

    return reply.status(201).send()
  })
}

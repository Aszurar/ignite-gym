import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { STATUS_INFO } from './constants'
import { env } from './env'
import { Environment } from './env/utils'
import { checkInRoutes } from './http/Routes/check-in'
import { gymRoutes } from './http/Routes/gym'
import { userRoutes } from './http/Routes/user'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(userRoutes)
app.register(gymRoutes)
app.register(checkInRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(STATUS_INFO.BAD_REQUEST.code).send({
      message: STATUS_INFO.BAD_REQUEST.messages.validation,
      issues: error.flatten().fieldErrors,
    })
  }

  if (env.NODE_ENV !== Environment.PROD) {
    console.error(error)
  } else {
    // TODO: log to an external service
    // e.g. Sentry, LogRocket, etc.
    // log.error(error)
  }

  return reply.status(STATUS_INFO.INTERNAL_SERVER_ERROR.code).send({
    message: STATUS_INFO.INTERNAL_SERVER_ERROR.messages.default,
  })
})

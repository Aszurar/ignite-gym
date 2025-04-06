import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { Environment } from './env/utils'
import { appRoutes } from './http/Routes/user'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
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

  return reply.status(500).send({
    message: 'Internal server error',
  })
})

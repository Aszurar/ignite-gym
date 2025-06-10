import { FastifyReply, FastifyRequest } from 'fastify'

import { STATUS_INFO } from '@/constants'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(STATUS_INFO.UNAUTHORIZED.code).send({
      statusCode: STATUS_INFO.UNAUTHORIZED.code,
      message: STATUS_INFO.UNAUTHORIZED.messages.default,
    })
  }
}

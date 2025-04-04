import 'dotenv/config'

import { z } from 'zod'

import { Environment } from './utils'

const envSchema = z.object({
  NODE_ENV: z
    .enum([Environment.TEST, Environment.DEV, Environment.PROD], {
      message:
        'Invalid NODE_ENV. Should be one of "test", "development" or "production"',
    })
    .default(Environment.DEV),
  PORT: z.coerce
    .number({
      invalid_type_error: 'PORT should be a number',
    })
    .default(3333),
  PASSWORD_ROUNDS: z.coerce
    .number({
      invalid_type_error: 'PASSWORD_ROUNDS should be a number',
    })
    .default(6),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  const skipLine = '\n'
  const title = `❌ Check your envs file - Environment variables validation failed ${skipLine}`

  const description =
    _env.error.errors
      .map((error, index) => `${index} - ${error.message}`)
      .join(`${skipLine}${skipLine}`) + skipLine

  const errorMessage = title + description

  throw new Error(errorMessage)
}

export const env = _env.data

import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { env } from '@/env'
import { InMemoryUserRepository } from '@/Repositories/InMemory/in-memory-user.repository'

import { AuthenticateUserUseCase } from '../authenticate-user.use-case'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

let inMemoryUserRepository: InMemoryUserRepository
let authenticateUserUseCase: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUserRepository,
    )
  })
  it("shouldn't be able to authenticate with non-existent user", async () => {
    const user = {
      email: 'johndoe@email.com',
      password: '1234567',
    }

    await expect(() => authenticateUserUseCase.execute(user)).rejects.toThrow(
      InvalidCredentialsError,
    )
  })

  it("shouldn't be able to authenticate with wrong password", async () => {
    const passwordHash = await hash('1234567', env.PASSWORD_ROUNDS)
    const userRegisterData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: passwordHash,
    }

    await inMemoryUserRepository.create(userRegisterData)

    const userAuthenticateData = {
      email: userRegisterData.email,
      password: 'xxxxxxxx',
    }

    await expect(() =>
      authenticateUserUseCase.execute(userAuthenticateData),
    ).rejects.toThrow(InvalidCredentialsError)
  })

  it('should be able to authenticate', async () => {
    const userPassword = '1234567'
    const passwordHash = await hash(userPassword, env.PASSWORD_ROUNDS)
    const userRegisterData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: passwordHash,
    }

    await inMemoryUserRepository.create(userRegisterData)

    const userAuthenticateData = {
      email: userRegisterData.email,
      password: userPassword,
    }

    const { user } = await authenticateUserUseCase.execute(userAuthenticateData)

    expect(user.id).toEqual(expect.any(String))
  })
})

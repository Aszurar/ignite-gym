import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { env } from '@/env'
import { InMemoryUserRepository } from '@/Repositories/InMemory/in-memory-user.repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetUserUseCase } from '../get-user.use-case'

let inMemoryUserRepository: InMemoryUserRepository
let getUserUseCase: GetUserUseCase

describe('get User Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    getUserUseCase = new GetUserUseCase(inMemoryUserRepository)
  })

  it('should be able to get user', async () => {
    const passwordHash = await hash('1234567', env.PASSWORD_ROUNDS)
    const userRegisterData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: passwordHash,
    }

    const user = await inMemoryUserRepository.create(userRegisterData)

    const { user: userProfile } = await getUserUseCase.execute({
      userId: user.id,
    })

    expect(userProfile.email).toEqual(expect.any(String))
  })

  it("shouldn't be able to get user if invalid used", async () => {
    const userId = {
      userId: 'non-existent user',
    }

    await expect(() => getUserUseCase.execute(userId)).rejects.toThrow(
      ResourceNotFoundError,
    )
  })
})

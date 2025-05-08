import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUserRepository } from '@/Repositories/InMemory/in-memory-user.repository'

import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { RegisterUserUseCase } from '../register-user.use-case'

let inMemoryUserRepository: InMemoryUserRepository
let registerUserUseCase: RegisterUserUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    registerUserUseCase = new RegisterUserUseCase(inMemoryUserRepository)
  })

  it('should be able to register a user', async () => {
    const { user } = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '1234567',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to register a user with the same email twice', async () => {
    const userEmail = 'johnDoe@email.com'

    const user = {
      name: 'John Doe',
      email: userEmail,
      password: '1234567',
    }

    await registerUserUseCase.execute(user)

    await expect(() => registerUserUseCase.execute(user)).rejects.toThrow(
      UserAlreadyExistsError,
    )
    //or .rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should hash user password upon registration', async () => {
    const userPassword = '1234567'

    const { user } = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'john@email.com',
      password: userPassword,
    })

    const isPasswordCorrectlyHashed = await compare(
      userPassword,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })
})

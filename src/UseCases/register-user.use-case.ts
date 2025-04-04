import { hash } from 'bcryptjs'

import { env } from '@/env'
import { IUserRepository } from '@/Repositories/interfaces/user.repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface IRegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
}

class RegisterUserUseCase {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(data: IRegisterUserUseCaseRequest) {
    const { name, email, password } = data

    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const rounds = env.PASSWORD_ROUNDS
    const passwordHash = await hash(password, rounds)

    await this.userRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })
  }
}

export { RegisterUserUseCase }

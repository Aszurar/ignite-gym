import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

import { IUserRepository } from '@/Repositories/interfaces/user.repository'

import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface IAuthenticateUserUseCaseRequest {
  email: string
  password: string
}

interface IAuthenticateUserUseCaseResponse {
  user: User
}

class AuthenticateUserUseCase {
  private readonly userRepository: IUserRepository
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute({
    email,
    password,
  }: IAuthenticateUserUseCaseRequest): Promise<IAuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}

export { AuthenticateUserUseCase }

import { User } from '@prisma/client'

import { IUserRepository } from '@/Repositories/interfaces/user.repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface IGetUserUseCaseRequest {
  userId: string
}

type UserResponseType = Omit<User, 'password_hash'>

interface IGetUserUseCaseResponse {
  user: UserResponseType
}

class GetUserUseCase {
  private readonly userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute({
    userId,
  }: IGetUserUseCaseRequest): Promise<IGetUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const userResponse: UserResponseType = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }

    return { user: userResponse }
  }
}

export { GetUserUseCase }

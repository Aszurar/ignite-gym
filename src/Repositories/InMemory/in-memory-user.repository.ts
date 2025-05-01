import { Prisma, User } from '@prisma/client'

import { IUserRepository } from '../interfaces/user.repository'

export class InMemoryUserRepository implements IUserRepository {
  public users: User[] = []

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const userId = crypto.randomUUID()

    const user: User = {
      id: userId,
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }
}

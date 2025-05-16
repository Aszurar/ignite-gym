import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

import { IGymRepository } from '../interfaces/gym.repository'

export class InMemoryGymRepository implements IGymRepository {
  public gyms: Gym[] = []

  async create(data: Prisma.GymUncheckedCreateInput): Promise<Gym> {
    const gymId = crypto.randomUUID()

    const gym: Gym = {
      id: gymId,
      title: data.title,
      phone: data.phone ?? null,
      description: data.description ?? null,
      latitude: new Decimal(data.latitude),
      longitude: new Decimal(data.longitude),
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}

import { Gym, Prisma } from '@prisma/client'

export type FindManyNearbyParamsType = {
  latitude: number
  longitude: number
}

export interface IGymRepository {
  findById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearby(params: FindManyNearbyParamsType, page: number): Promise<Gym[]>
}

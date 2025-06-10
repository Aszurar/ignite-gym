import { Gym, Prisma } from '@prisma/client'

import { IMeta } from '@/utils/meta'

export type IFindManyNearbyParamsType = {
  latitude: number
  longitude: number
}

export interface IFindManyNearbyResponseType {
  data: {
    gyms: Gym[]
  }
  meta: IMeta
}

export interface IGymRepository {
  findById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearby(
    params: IFindManyNearbyParamsType,
    page: number,
  ): Promise<IFindManyNearbyResponseType>
}

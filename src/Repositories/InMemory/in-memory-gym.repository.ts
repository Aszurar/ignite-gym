import { Gym, Prisma } from '@prisma/client'

import { getDistanceBetweenCoordinates } from '@/utils/distance'

import {
  FindManyNearbyParamsType,
  IGymRepository,
} from '../interfaces/gym.repository'

export class InMemoryGymRepository implements IGymRepository {
  public gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gymId = crypto.randomUUID()

    const gym: Gym = {
      id: gymId,
      title: data.title,
      phone: data.phone ?? null,
      description: data.description ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
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

  /**
   * Busca Academias pelo nome com paginação
   *
   * @param params - Nome da Academia do usuário
   * @param page - Número da página (começa em 1)
   * @returns Array com até 20 academias da página solicitada
   *
   * @example
   * // Para a página 1:
   * const gyms = await gymRepository.searchMany(
   *   Academia 1, // Exemplo de coordenadas
   *   1 // Página 1
   *  )
   * // Retorna as primeiras 20 academias com nome semelhante
   * // Exemplo de retorno: [gym1, gym2, ..., gym20]
   * * @example
   * // Para a página 2:
   * const gyms = await gymRepository.searchMany(
   *  Academia 2, // Exemplo de coordenadas
   *  2 // Página 2
   * )
   * // Retorna 20 academias com nome semelhante
   * // Exemplo de retorno: [gym21, gym22, ..., gym40]
   *
   * @description
   * A paginação funciona com o método slice(start, end):
   *
   * - start: (page - 1) * 20
   *   - Página 1: (1-1) * 20 = 0 (começa no índice 0)
   *   - Página 2: (2-1) * 20 = 20 (começa no índice 20)
   *   - Página 3: (3-1) * 20 = 40 (começa no índice 40)
   *
   * - end: start + 20
   *   - Sempre 20 posições após o start
   *   - Página 1: 0 + 20 = 20 (pega até índice 19)
   *   - Página 2: 20 + 20 = 40 (pega até índice 39)
   *
   * - slice(start, end):
   *   - Extrai elementos do índice 'start' até 'end-1'
   *   - slice(0, 20) → pega índices [0, 1, 2, ..., 19]
   *   - slice(20, 40) → pega índices [20, 21, 22, ..., 39]
   *   - O índice 'end' NÃO é incluído no resultado
   *
   * - Total: 85 check-ins
   *   - Items por página: 20
   *   - Página 1: itens 0-19    (20 itens)
   *   - Página 2: itens 20-39   (20 itens)
   *   - Página 3: itens 40-59   (20 itens)
   *   - Página 4: itens 60-79   (20 itens)
   *   - Página 5: itens 80-84   (5 itens)
   */
  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = this.gyms.filter((gym) => gym.title.includes(query))
    // 2. Calcula índices de início e fim
    const start = (page - 1) * 20 // Índice inicial
    const end = start + 20 // Índice final

    // 3. Retorna apenas os itens da página atual
    const paginatedGyms = gyms.slice(start, end)

    return paginatedGyms
  }

  /**
   * Busca Academias próximas(até 10km) com paginação
   *
   * @param params - Parâmetros de localização (latitude e longitude) do usuário
   * @param page - Número da página (começa em 1)
   * @returns Array com até 20 academias da página solicitada
   *
   * @example
   * // Para a página 1:
   * const nearbyGymsPage1 = await gymRepository.findManyNearby(
   *   { latitude: 40.7128, longitude: -74.0060 }, // Exemplo de coordenadas
   *   1 // Página 1
   *  )
   * // Retorna as primeiras 20 academias próximas
   * // Exemplo de retorno: [gym1, gym2, ..., gym20]
   * * @example
   * // Para a página 2:
   * const nearbyGymsPage2 = await gymRepository.findManyNearby(
   *  { latitude: 40.7128, longitude: -74.0060 }, // Exemplo de coordenadas
   *  2 // Página 2
   * )
   * // Retorna as próximas 20 academias próximas
   * // Exemplo de retorno: [gym21, gym22, ..., gym40]
   *
   * @description
   * A paginação funciona com o método slice(start, end):
   *
   * - start: (page - 1) * 20
   *   - Página 1: (1-1) * 20 = 0 (começa no índice 0)
   *   - Página 2: (2-1) * 20 = 20 (começa no índice 20)
   *   - Página 3: (3-1) * 20 = 40 (começa no índice 40)
   *
   * - end: start + 20
   *   - Sempre 20 posições após o start
   *   - Página 1: 0 + 20 = 20 (pega até índice 19)
   *   - Página 2: 20 + 20 = 40 (pega até índice 39)
   *
   * - slice(start, end):
   *   - Extrai elementos do índice 'start' até 'end-1'
   *   - slice(0, 20) → pega índices [0, 1, 2, ..., 19]
   *   - slice(20, 40) → pega índices [20, 21, 22, ..., 39]
   *   - O índice 'end' NÃO é incluído no resultado
   *
   * - Total: 85 check-ins
   *   - Items por página: 20
   *   - Página 1: itens 0-19    (20 itens)
   *   - Página 2: itens 20-39   (20 itens)
   *   - Página 3: itens 40-59   (20 itens)
   *   - Página 4: itens 60-79   (20 itens)
   *   - Página 5: itens 80-84   (5 itens)
   */
  async findManyNearby(params: FindManyNearbyParamsType, page: number) {
    const nearbyDistance = 10 // Distância máxima em unidades (ex: km, milhas)
    const { latitude, longitude } = params

    // 1. Filtra academias próximas com base na latitude e longitude
    const nearbyGyms = this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates({
        from: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        to: {
          latitude: Number(gym.latitude),
          longitude: Number(gym.longitude),
        },
      })

      return distance <= nearbyDistance
    })

    // 2. Calcula índices de início e fim
    const start = (page - 1) * 20 // Índice inicial
    const end = start + 20 // Índice final

    // 3. Retorna apenas os itens da página atual
    const paginatedGyms = nearbyGyms.slice(start, end)

    return paginatedGyms
  }
}

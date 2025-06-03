import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

import { ICheckInRepository } from '../interfaces/check-in.repository'

export class InMemoryCheckInRepository implements ICheckInRepository {
  public checkIns: CheckIn[] = []

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find((checkIn) => checkIn.id === id)

    return checkIn || null
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkInId = crypto.randomUUID()

    const checkIn = {
      id: checkInId,
      gym_id: data.gym_id,
      user_id: data.user_id,
      validate_at: data.validate_at ? new Date(data.validate_at) : null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.checkIns.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfDate = dayjs(date).startOf('date')
    const endOfDate = dayjs(date).endOf('date')

    // Check if the check-in exists for the user within the same data
    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const isSameUser = checkIn.user_id === userId
      const oldCheckInDate = dayjs(checkIn.created_at)

      const isOnSameDate =
        oldCheckInDate.isAfter(startOfDate) &&
        oldCheckInDate.isBefore(endOfDate)

      return isSameUser && isOnSameDate
    })

    return checkInOnSameDate || null
  }

  /**
   * Busca check-ins de um usuário com paginação
   *
   * @param userId - ID do usuário
   * @param page - Número da página (começa em 1)
   * @returns Array com até 20 check-ins da página solicitada
   *
   * @example
   * // Considerando 85 check-ins no total:
   * findManyByUserId('user-123', 1) // Retorna itens 0-19   (20 itens)
   * findManyByUserId('user-123', 2) // Retorna itens 20-39  (20 itens)
   * findManyByUserId('user-123', 3) // Retorna itens 40-59  (20 itens)
   * findManyByUserId('user-123', 4) // Retorna itens 60-79  (20 itens)
   * findManyByUserId('user-123', 5) // Retorna itens 80-84  (5 itens)
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
  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.checkIns.filter(
      (checkIn) => checkIn.user_id === userId,
    )
    // 2. Calcula índices de início e fim
    const start = (page - 1) * 20 // Índice inicial
    const end = start + 20 // Índice final

    // 3. Retorna apenas os itens da página atual
    const paginatedCheckIns = checkIns.slice(start, end)

    return paginatedCheckIns
  }

  async countByUserId(userId: string): Promise<number> {
    const userCheckIns = this.checkIns.filter(
      (checkIn) => checkIn.user_id === userId,
    )

    return userCheckIns.length
  }

  async update(checkInValidated: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.checkIns.findIndex(
      (checkInItem) => checkInItem.id === checkInValidated.id,
    )

    const hasCheckIn = checkInIndex !== -1

    if (hasCheckIn) {
      this.checkIns[checkInIndex] = checkInValidated
    }

    return checkInValidated
  }
}

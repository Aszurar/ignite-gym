import { STATUS_INFO } from '@/constants'

class InvalidDistanceBetweenUserAndGym extends Error {
  public readonly code: number
  constructor() {
    super(
      STATUS_INFO.UNPROCESSABLE_ENTITY.messages
        .invalidDistanceBetweenUserAndGym,
    )
    this.code = STATUS_INFO.UNPROCESSABLE_ENTITY.code
    this.name = 'InvalidDistanceBetweenUserAndGym'
  }
}
export { InvalidDistanceBetweenUserAndGym }

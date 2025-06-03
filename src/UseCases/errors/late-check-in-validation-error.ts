import { STATUS_INFO } from '@/constants'

class LateCheckInValidationError extends Error {
  public readonly code: number
  constructor() {
    super(STATUS_INFO.BAD_REQUEST.messages.invalidCredentials)
    this.code = STATUS_INFO.UNPROCESSABLE_ENTITY.code
    this.name = 'LateCheckInValidationError'
  }
}
export { LateCheckInValidationError }

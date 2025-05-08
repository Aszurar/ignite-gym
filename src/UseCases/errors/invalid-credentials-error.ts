import { STATUS_INFO } from '@/constants'

class InvalidCredentialsError extends Error {
  public readonly code: number
  constructor() {
    super(STATUS_INFO.BAD_REQUEST.messages.invalidCredentials)
    this.code = STATUS_INFO.BAD_REQUEST.code
    this.name = 'InvalidCredentialsError'
  }
}
export { InvalidCredentialsError }

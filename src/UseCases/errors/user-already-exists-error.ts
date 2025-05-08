import { STATUS_INFO } from '@/constants'

class UserAlreadyExistsError extends Error {
  public readonly code: number
  constructor() {
    super(STATUS_INFO.CONFLICT.messages.userAlreadyExists)
    this.name = 'UserAlreadyExistsError'
    this.code = STATUS_INFO.CONFLICT.code
  }
}
export { UserAlreadyExistsError }

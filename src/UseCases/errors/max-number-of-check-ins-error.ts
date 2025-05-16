import { STATUS_INFO } from '@/constants'

class MaxNumberOfCheckInsError extends Error {
  public readonly code: number
  constructor() {
    super(STATUS_INFO.CONFLICT.messages.maxNumberOfCheckInsError)
    this.code = STATUS_INFO.CONFLICT.code
    this.name = 'MaxNumberOfCheckInsError'
  }
}
export { MaxNumberOfCheckInsError }

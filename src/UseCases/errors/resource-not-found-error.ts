import { STATUS_INFO } from '@/constants'

class ResourceNotFoundError extends Error {
  public readonly code: number
  constructor() {
    super(STATUS_INFO.NOT_FOUND.messages.default)
    this.name = 'ResourceNotFoundError'
    this.code = STATUS_INFO.NOT_FOUND.code
  }
}
export { ResourceNotFoundError }

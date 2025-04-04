class UserAlreadyExistsError extends Error {
  constructor() {
    super('User already exists')
    this.name = 'UserAlreadyExistsError'
  }
}
export { UserAlreadyExistsError }

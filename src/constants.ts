const STATUS_INFO = {
  OK: {
    code: 200,
    messages: {
      default: '',
    },
  },
  CREATED: {
    code: 201,
    messages: {
      default: '',
    },
  },
  NO_CONTENT: {
    code: 204,
    messages: {
      default: '',
    },
  },
  BAD_REQUEST: {
    code: 400,
    messages: {
      default: '',
      validation: 'Validation error',
      invalidCredentials: 'Invalid credentials',
    },
  },
  UNAUTHORIZED: {
    code: 401,
    messages: {
      default: '',
    },
  },
  FORBIDDEN: {
    code: 403,
    messages: {
      default: '',
    },
  },
  NOT_FOUND: {
    code: 404,
    messages: {
      default: 'Resource not found',
    },
  },
  CONFLICT: {
    code: 409,
    messages: {
      default: '',
      userAlreadyExists: 'User already exists',
    },
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    messages: {
      default: 'Internal Server Error',
    },
  },
} as const

export { STATUS_INFO }

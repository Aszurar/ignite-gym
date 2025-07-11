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
      default: 'Unauthorized',
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
      userAlreadyExists: 'User already exists.',
      maxNumberOfCheckInsError: 'Max number of check-ins reached.',
    },
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    messages: {
      default: '',
      invalidDistanceBetweenUserAndGym: 'Invalid distance between user and gym',
      lateCheckInValidationError:
        'The check-in can only be validated until 20 minutes of its creation.',
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

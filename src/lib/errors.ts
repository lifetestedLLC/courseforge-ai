// Centralized error handling for the application

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
    public code?: string
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, true, code || 'VALIDATION_ERROR')
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, true, 'AUTHENTICATION_ERROR')
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, true, 'AUTHORIZATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, true, 'NOT_FOUND')
  }
}

export class StripeError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, true, code || 'STRIPE_ERROR')
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 500, true, code || 'DATABASE_ERROR')
  }
}

// Error handler for API routes
export function handleError(error: unknown): {
  status: number
  message: string
  code?: string
} {
  console.error('Error occurred:', error)

  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      message: error.message,
      code: error.code,
    }
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('Unique constraint')) {
      return {
        status: 409,
        message: 'Resource already exists',
        code: 'DUPLICATE_RESOURCE',
      }
    }

    if (error.message.includes('Foreign key constraint')) {
      return {
        status: 400,
        message: 'Invalid reference to related resource',
        code: 'INVALID_REFERENCE',
      }
    }

    if (error.name === 'ZodError') {
      return {
        status: 422,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
      }
    }
  }

  // Default error response
  return {
    status: 500,
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
  }
}

// Async error wrapper for API routes
export function asyncHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error('Async handler error:', error)
      throw error
    }
  }) as T
}

// Logger utility
export class Logger {
  private static formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`
  }

  static info(message: string, meta?: any) {
    console.log(this.formatMessage('info', message, meta))
  }

  static warn(message: string, meta?: any) {
    console.warn(this.formatMessage('warn', message, meta))
  }

  static error(message: string, error?: any, meta?: any) {
    const errorMeta = {
      ...meta,
      error: error?.message || error,
      stack: error?.stack,
    }
    console.error(this.formatMessage('error', message, errorMeta))
  }

  static debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, meta))
    }
  }
}
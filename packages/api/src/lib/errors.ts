/**
 * Domain-specific error classes
 * Provides clear error types for different failure scenarios
 */

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, id?: string) {
    super(id ? `${resource} with id ${id} not found` : `${resource} not found`, "NOT_FOUND", 404);
  }
}

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly fields?: Record<string, string[]>,
  ) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, "CONFLICT", 409);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = "Forbidden") {
    super(message, "FORBIDDEN", 403);
  }
}

export class InsufficientBalanceError extends DomainError {
  constructor(assetId: string, available: string, requested: string) {
    super(
      `Insufficient balance for ${assetId}. Available: ${available}, Requested: ${requested}`,
      "INSUFFICIENT_BALANCE",
      400,
    );
  }
}

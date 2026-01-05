/**
 * Error Handler Middleware
 * Centralized error handling for all routes
 *
 * Handles:
 * - Domain errors (with status codes)
 * - Validation errors (Zod)
 * - JWT errors
 * - Unexpected errors
 */

import { Context, Next } from "hono";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { DomainError, ValidationError } from "../libs/errors";
import { ContentfulStatusCode } from "hono/utils/http-status";

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

/**
 * Error handler middleware
 * Should be registered as the last middleware
 */
export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    return handleError(c, error);
  }
}

/**
 * Handle different types of errors and return appropriate responses
 */
function handleError(c: Context, error: unknown): Response {
  // Domain errors (our custom errors)
  if (error instanceof DomainError) {
    const response: ErrorResponse = {
      error: error.message,
      code: error.code,
    };

    // Add validation field errors if available
    if (error instanceof ValidationError && error.fields) {
      response.details = error.fields;
    }

    return c.json(response, error.statusCode as ContentfulStatusCode);
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return c.json(
      {
        error: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.flatten().fieldErrors as Record<string, string[]>,
      },
      400,
    );
  }

  // JWT errors
  if (error instanceof jwt.JsonWebTokenError) {
    return c.json(
      {
        error: "Invalid token",
        code: "INVALID_TOKEN",
      },
      401,
    );
  }

  if (error instanceof jwt.TokenExpiredError) {
    return c.json(
      {
        error: "Token expired",
        code: "TOKEN_EXPIRED",
      },
      401,
    );
  }

  // Generic Error
  if (error instanceof Error) {
    console.error("Unhandled error:", error);
    return c.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      500,
    );
  }

  // Unknown error type
  console.error("Unknown error type:", error);
  return c.json(
    {
      error: "Internal server error",
      code: "UNKNOWN_ERROR",
    },
    500,
  );
}

/**
 * Async error handler wrapper
 * Wraps async route handlers to catch errors
 */
export function asyncHandler(
  handler: (c: Context) => Promise<Response>,
): (c: Context) => Promise<Response> {
  return async (c: Context) => {
    try {
      return await handler(c);
    } catch (error) {
      return handleError(c, error);
    }
  };
}

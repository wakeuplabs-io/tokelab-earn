/**
 * Test helper for making HTTP requests to the Hono app
 */

import app from "../../src/app";

export { app };

export interface RequestOptions {
  query?: Record<string, string>;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Make a request to the test app
 */
export async function request(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  path: string,
  options?: RequestOptions,
): Promise<Response> {
  const url = new URL(path, "http://localhost");

  if (options?.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const init: RequestInit = {
    method,
    headers: options?.headers,
  };

  if (options?.body) {
    init.body = JSON.stringify(options.body);
    init.headers = {
      ...init.headers,
      "Content-Type": "application/json",
    };
  }

  const req = new Request(url.toString(), init);
  return app.fetch(req);
}

/**
 * Parse JSON response
 */
export async function json<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

/**
 * Shorthand for GET request with JSON parsing
 */
export async function get<T>(
  path: string,
  query?: Record<string, string>,
): Promise<{ response: Response; data: T }> {
  const response = await request("GET", path, { query });
  const data = await json<T>(response);
  return { response, data };
}

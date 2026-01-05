import type { Hono } from "hono";
import type { Schema } from "hono";
import type { PinoLogger } from "hono-pino";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}

export type AppType<S extends Schema> = Hono<AppBindings, S>;

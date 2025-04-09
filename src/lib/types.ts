import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
// import type { Env } from 'hono';
import type { PinoLogger } from 'hono-pino';

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    user: { userId: number };
  };
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;
export type AppRouteHandler<T extends RouteConfig> = RouteHandler<
  T,
  AppBindings
>;

// export type AppRouteHandler<
//   R extends RouteConfig,
//   A extends Env = AppBindings,
// > = RouteHandler<R, A>;

// export type AppMiddlewareVariables<T extends object> = AppBindings & {
//   Variables: T;
// };

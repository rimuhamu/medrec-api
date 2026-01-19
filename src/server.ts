/* eslint-disable no-console */
import { serve } from "@hono/node-server";
import app from "./app.ts";
import env from "./env.ts";

const port = Number(env.PORT || 3000);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`✅ Medrec API is running on http://localhost:${info.port}`);
    console.log(
      `📖 API Documentation: http://localhost:${info.port}/reference`,
    );
  },
);

export default app;

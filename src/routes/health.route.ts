import { createRouter } from "@/lib/create-app";
import { createRoute } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import * as HttpStatusCodes from "stoker/http-status-codes";

const router = createRouter().openapi(
  createRoute({
    tags: ["Health"],
    method: "get",
    path: "/health",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema("Medrec API"),
        "Medrec API health check",
      ),
    },
  }),
  (c) => {
    return c.json(
      {
        message: "Medrec API is up and running",
      },
      HttpStatusCodes.OK,
    );
  },
);

export default router;

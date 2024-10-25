import { FastifyInstance } from "fastify";
import { helloDatabaseController } from "./controllers/hello/hello-database.controller";
import { helloController } from "./controllers/hello/hello.controller";

export async function routes(app: FastifyInstance) {
  app.register(helloController);
  app.register(helloDatabaseController);
}

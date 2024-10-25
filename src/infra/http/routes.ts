import { FastifyInstance } from "fastify";
import { helloController } from "./controllers/hello/hello.controller";

export async function routes(app: FastifyInstance) {
  app.register(helloController);
}

import { drizzle } from "@/infra/database";
import { sql } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { DatabaseConnectionError } from "../../errors/database-connection.error";

export async function helloDatabaseController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/hello/database",
    schema: {
      tags: ["Hello"],
      summary: "Hello database!",
      response: {
        200: z.object({
          message: z.literal("Tudo certo com o banco de dados!"),
        }),
      },
    },
    handler: async (_, res) => {
      try {
        await drizzle.execute(sql`SELECT 'status';`);
      } catch (error) {
        throw new DatabaseConnectionError(error);
      }

      res.status(200).send({ message: "Tudo certo com o banco de dados!" });
    },
  });
}

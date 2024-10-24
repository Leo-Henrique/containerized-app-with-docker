import { sql } from "drizzle-orm";
import { drizzle } from "./database";
import { env } from "./env";
import { app } from "./http/app";

(async () => {
  await app.ready();
  await app.listen({ host: "0.0.0.0", port: env.API_PORT });
  await drizzle.execute(sql`SELECT 'status';`);

  console.log(`Application "${env.API_NAME}" is running!`);

  if (env.NODE_ENV === "development")
    console.log(`http://localhost:${env.API_PORT}/docs`);
})();

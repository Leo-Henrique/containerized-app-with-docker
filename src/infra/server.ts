import { env } from "./env";
import { app } from "./http/app";

(async () => {
  await app.ready();
  await app.listen({ host: "0.0.0.0", port: env.API_PORT });

  console.log(`Application "${env.API_NAME}" is running!`);
  console.log(`http://${env.API_HOST}:${env.API_PORT}/docs`);
})();

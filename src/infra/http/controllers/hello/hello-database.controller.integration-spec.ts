import { drizzle } from "@/infra/database";
import { app } from "@/infra/http/app";
import { sql } from "drizzle-orm";
import request from "supertest";
import { describe, expect, it } from "vitest";

describe("[Controller] GET /hello/database", () => {
  it("should be able to show success message if the database is working", async () => {
    const response = await request(app.server).get("/hello/database");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      message: "Tudo certo com o banco de dados!",
    });

    const {
      rows: [{ ok }],
    } = await drizzle.execute(sql`SELECT true AS "ok";`);

    expect(ok).toBeTruthy();
  });
});

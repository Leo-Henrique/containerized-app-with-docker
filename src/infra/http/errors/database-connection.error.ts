import { HttpError } from "@/core/domain-error";

const message = "Ops, não foi possível se comunicar com o banco de dados :(";

export class DatabaseConnectionError extends HttpError {
  readonly statusCode = 503;
  readonly error = "DATABASE_CONNECTION_ERROR";
  readonly message = message;

  constructor(public debug: unknown) {
    super(message);
  }
}

import { StatusCodes, ReasonPhrases } from "http-status-codes";

export class CurrentAttemptError extends Error {
  constructor(
    public message: string,
    public status: StatusCodes,
    public statusText: ReasonPhrases
  ) {
    super(message);
  }
}

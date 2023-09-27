import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { CurrentAttemptError } from "./CurrentAttemptError";

export class NoAttemptInProgressError extends CurrentAttemptError {
  constructor() {
    super(
      "No attempt in progress",
      StatusCodes.NOT_FOUND,
      ReasonPhrases.NOT_FOUND
    );
  }
}

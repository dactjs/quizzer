import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { CurrentAttemptError } from "./CurrentAttemptError";

export class AnAttemptIsAlreadyInProgressError extends CurrentAttemptError {
  constructor() {
    super(
      "An attempt is already in progress",
      StatusCodes.CONFLICT,
      ReasonPhrases.CONFLICT
    );
  }
}

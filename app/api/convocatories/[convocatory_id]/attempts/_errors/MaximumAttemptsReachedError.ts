import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { CurrentAttemptError } from "./CurrentAttemptError";

export class MaximumAttemptsReachedError extends CurrentAttemptError {
  constructor() {
    super(
      "Maximum attempts reached",
      StatusCodes.FORBIDDEN,
      ReasonPhrases.FORBIDDEN
    );
  }
}

import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { CurrentAttemptError } from "./CurrentAttemptError";

export class OutOfScheduledDateError extends CurrentAttemptError {
  constructor() {
    super(
      "Out of scheduled date",
      StatusCodes.FORBIDDEN,
      ReasonPhrases.FORBIDDEN
    );
  }
}

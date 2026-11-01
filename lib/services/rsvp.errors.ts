export type RsvpServiceErrorCode = "INVITE_INVALID" | "AT_CAPACITY";

export class RsvpServiceError extends Error {
  readonly code: RsvpServiceErrorCode;

  constructor(code: RsvpServiceErrorCode) {
    super(code);
    this.code = code;
  }
}

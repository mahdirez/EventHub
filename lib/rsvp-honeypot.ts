/** Honeypot field name — must stay empty for legitimate submissions. */
export const RSVP_HONEYPOT_FIELD = "company";

export function isRsvpHoneypotFilled(formData: FormData): boolean {
  const value = formData.get(RSVP_HONEYPOT_FIELD);
  if (typeof value !== "string") {
    return false;
  }

  return value.trim().length > 0;
}

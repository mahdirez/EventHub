import type { RsvpStatus } from "@/app/generated/prisma/enums";

export type StoredRsvp = {
  name: string;
  email: string;
  status: RsvpStatus;
};

function storageKey(token: string) {
  return `eventhub-rsvp:${token}`;
}

export function getStoredRsvp(token: string): StoredRsvp | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey(token));
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as StoredRsvp;
  } catch {
    return null;
  }
}

export function setStoredRsvp(token: string, rsvp: StoredRsvp) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey(token), JSON.stringify(rsvp));
  } catch {
    // Ignore storage failures in private browsing or quota errors.
  }
}

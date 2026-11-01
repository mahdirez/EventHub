const RSVP_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RSVP_MAX_SUBMISSIONS_PER_IP = 15;
const RSVP_MAX_SUBMISSIONS_PER_TOKEN = 8;

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const ipBuckets = new Map<string, RateLimitBucket>();
const tokenBuckets = new Map<string, RateLimitBucket>();

export type RsvpRateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: "ip" | "token" };

function consumeLimit(
  store: Map<string, RateLimitBucket>,
  key: string,
  max: number,
  now: number,
): boolean {
  let bucket = store.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + RSVP_RATE_LIMIT_WINDOW_MS };
    store.set(key, bucket);
  }

  if (bucket.count >= max) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export function checkRsvpRateLimit(
  ip: string,
  token: string,
  now = Date.now(),
): RsvpRateLimitResult {
  const normalizedIp = ip.trim() || "unknown";

  if (
    !consumeLimit(
      ipBuckets,
      normalizedIp,
      RSVP_MAX_SUBMISSIONS_PER_IP,
      now,
    )
  ) {
    return { allowed: false, reason: "ip" };
  }

  if (
    !consumeLimit(tokenBuckets, token, RSVP_MAX_SUBMISSIONS_PER_TOKEN, now)
  ) {
    return { allowed: false, reason: "token" };
  }

  return { allowed: true };
}

/** @internal */
export function resetRsvpRateLimitStoreForTests() {
  ipBuckets.clear();
  tokenBuckets.clear();
}

export const rsvpRateLimitConfig = {
  windowMs: RSVP_RATE_LIMIT_WINDOW_MS,
  maxPerIp: RSVP_MAX_SUBMISSIONS_PER_IP,
  maxPerToken: RSVP_MAX_SUBMISSIONS_PER_TOKEN,
} as const;

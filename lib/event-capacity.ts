export function isEventAtCapacity(
  capacity: number | null | undefined,
  goingCount: number,
): boolean {
  return capacity != null && goingCount >= capacity;
}

export function canRsvpGoing(
  capacity: number | null | undefined,
  goingCount: number,
  existingStatus?: string | null,
): boolean {
  if (capacity == null) {
    return true;
  }

  if (existingStatus === "going") {
    return true;
  }

  return goingCount < capacity;
}

export function formatCapacityLabel(
  capacity: number | null | undefined,
  goingCount: number,
  template: string,
): string | null {
  if (capacity == null) {
    return null;
  }

  return template
    .replace("{going}", String(goingCount))
    .replace("{capacity}", String(capacity));
}

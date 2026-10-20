export function formatCompactCount(value: number): string {
  if (value >= 1000) {
    const compact = value / 1000;
    const formatted =
      compact >= 10 ? Math.round(compact) : Math.round(compact * 10) / 10;
    return `${formatted}k`;
  }

  return String(value);
}

export function formatEventDate(
  iso: string,
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

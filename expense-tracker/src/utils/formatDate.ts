export function formatDateRange(start: Date, end: Date): string {
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.getDate().toString().padStart(2, "0")}–${end
      .getDate()
      .toString()
      .padStart(2, "0")} ${end.toLocaleDateString("en-ZA", {
      month: "short",
      year: "numeric",
    })}`;
  }

  if (sameYear) {
    return `${start.toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "short",
    })} – ${end.toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  }

  return `${start.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} – ${end.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;
}

/**
 * Formats an API timestamp string ("YYYY-MM-DD HH:MM:SS") into a human-readable string.
 * Example: "2026-06-03 07:57:26" -> "Jun 3, 2026, 07:57 AM"
 */
export function formatTimestamp(timestampStr: string): string {
  try {
    const normalizedTime = timestampStr.replace(" ", "T");
    const date = new Date(normalizedTime);
    if (isNaN(date.getTime())) return timestampStr;
    
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (err) {
    return timestampStr;
  }
}

import { LocalNotification, NotificationType } from "../types";

const TYPE_WEIGHTS: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Calculates priority scores for a list of notifications based on type weight and recency,
 * and returns the top N notifications.
 *
 * Weight: Placement (3) > Result (2) > Event (1)
 * Score: typeWeight + recencyScore (normalized between 0 and 1)
 */
export function calculatePriority(
  notifications: LocalNotification[],
  N: number
): LocalNotification[] {
  if (notifications.length === 0) return [];

  // Parse all timestamps to epoch milliseconds
  const parsedNotifications = notifications.map((n) => {
    // API Timestamps look like "2026-06-03 07:57:26"
    // Convert to standard ISO format "2026-06-03T07:57:26" for robust parsing
    const normalizedTime = n.Timestamp.replace(" ", "T");
    const ms = new Date(normalizedTime).getTime() || 0;
    return { ...n, ms };
  });

  const timestamps = parsedNotifications.map((n) => n.ms);
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);
  const timeDiff = maxTime - minTime;

  const scoredNotifications = parsedNotifications.map((n) => {
    const weight = TYPE_WEIGHTS[n.Type] || 0;
    // Normalize recency between 0.0 and 1.0. If all timestamps are identical, recencyScore is 1.0.
    const recencyScore = timeDiff > 0 ? (n.ms - minTime) / timeDiff : 1.0;
    const priorityScore = weight + recencyScore;
    return {
      ...n,
      priorityScore,
    };
  });

  // Sort descending by priorityScore
  scoredNotifications.sort((a, b) => {
    const scoreA = a.priorityScore ?? 0;
    const scoreB = b.priorityScore ?? 0;
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    // Tie-breaker: Newer timestamp first
    return b.ms - a.ms;
  });

  // Remove the temporary `ms` field and slice top N
  return scoredNotifications
    .map(({ ms, ...rest }) => rest as LocalNotification)
    .slice(0, N);
}

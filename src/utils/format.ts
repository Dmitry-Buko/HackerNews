/** Английские формы множественного числа: plural(5, 'point', 'points') → 'points' */
export function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

/** Относительное время: «just now», «5 minutes ago», «2 hours ago»; старше недели — дата */
export function formatRelativeTime(unixSeconds: number, nowMs: number = Date.now()): string {
  const diffSec = Math.floor((nowMs - unixSeconds * 1000) / 1000);
  if (diffSec < 60) return 'just now';
  const minutes = Math.floor(diffSec / 60);
  if (minutes < 60) {
    return `${minutes} ${plural(minutes, 'minute', 'minutes')} ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${plural(hours, 'hour', 'hours')} ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} ${plural(days, 'day', 'days')} ago`;
  }
  return formatFullDate(unixSeconds);
}

/** Полная дата для тултипа: «October 13, 2026, 7:48 PM» */
export function formatFullDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/** Рейтинг: «89 points» */
export function formatScore(score: number): string {
  return `${score} ${plural(score, 'point', 'points')}`;
}

/** Количество комментариев: «1203 comments» */
export function formatCommentsCount(count: number): string {
  return `${count} ${plural(count, 'comment', 'comments')}`;
}

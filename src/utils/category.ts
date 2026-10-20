/**
 * Цвет тега категории новости. Известным категориям — подобранный вручную
 * цвет, незнакомым — детерминированный из палитры (одна категория всегда
 * получает один и тот же цвет).
 */

const PALETTE = [
  'blue',
  'green',
  'purple',
  'orange',
  'cyan',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
] as const;

const KNOWN_COLORS: Record<string, string> = {
  Databases: 'blue',
  Compilers: 'purple',
  Interview: 'cyan',
  Discussion: 'orange',
  Tools: 'green',
  Web: 'geekblue',
  Development: 'volcano',
  Security: 'magenta',
  'Programming Languages': 'geekblue',
};

export function categoryColor(category: string): string {
  const known = KNOWN_COLORS[category];
  if (known) {
    return known;
  }
  let hash = 0;
  for (const ch of category) {
    hash = (hash * 31 + ch.codePointAt(0)!) % 997;
  }
  return PALETTE[hash % PALETTE.length];
}

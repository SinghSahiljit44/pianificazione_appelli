export function parseDay(v: string | Date): Date {
  if (typeof v === 'string') {
    const [y, m, d] = v.slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(v.getFullYear(), v.getMonth(), v.getDate());
}

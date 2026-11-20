export const MIN_AGE = 18;

/** Idade completa em anos numa data de referência (padrão: hoje, UTC). */
export function ageOn(birthDate: string, today: Date = new Date()): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!m) return NaN;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const check = new Date(Date.UTC(y, mo - 1, d));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d) {
    return NaN;
  }
  const ty = today.getUTCFullYear();
  const tm = today.getUTCMonth() + 1;
  const td = today.getUTCDate();
  let age = ty - y;
  if (tm < mo || (tm === mo && td < d)) age -= 1;
  return age;
}

export function isAdult(birthDate: string, today?: Date): boolean {
  const age = ageOn(birthDate, today);
  return Number.isFinite(age) && age >= MIN_AGE && age < 120;
}

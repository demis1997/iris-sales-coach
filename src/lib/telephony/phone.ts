/** Require explicit international numbers; never guess a deployment country. */
export function normalizeE164(raw: string): string {
  if (!/^[+0-9 ()\-.]+$/.test(raw.trim()))
    throw new Error("Use an international number like +35799123456");
  let digits = raw.trim().replace(/[ ()\-.]/g, "");
  if (digits.startsWith("00")) digits = "+" + digits.slice(2);
  if (!/^\+[1-9]\d{7,14}$/.test(digits))
    throw new Error("Use an international number like +35799123456");
  return digits;
}

export function maskPhone(e164: string | null | undefined): string {
  if (!e164) return "—";
  if (e164.length < 6) return e164;
  return `${e164.slice(0, 4)}···${e164.slice(-3)}`;
}

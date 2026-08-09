/** Normalize to E.164-ish (+digits). Throws if unusable. */
export function normalizeE164(raw: string, defaultCountry = "357"): string {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Enter a phone number");

  let digits = trimmed.replace(/[^\d+]/g, "");
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (!digits.startsWith("+")) {
    const local = digits.replace(/\D/g, "");
    if (local.startsWith("0")) {
      digits = `+${defaultCountry}${local.slice(1)}`;
    } else if (local.length <= 8) {
      digits = `+${defaultCountry}${local}`;
    } else {
      digits = `+${local}`;
    }
  }

  const cleaned = `+${digits.slice(1).replace(/\D/g, "")}`;
  if (!/^\+[1-9]\d{7,14}$/.test(cleaned)) {
    throw new Error("Use an international number like +35799123456");
  }
  return cleaned;
}

export function maskPhone(e164: string | null | undefined): string {
  if (!e164) return "—";
  if (e164.length < 6) return e164;
  return `${e164.slice(0, 4)}···${e164.slice(-3)}`;
}

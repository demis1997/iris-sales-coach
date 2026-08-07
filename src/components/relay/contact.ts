/** Public contact details for Artemis AI marketing surfaces. */
export const CONTACT_EMAIL = "demis.konstantinou16@gmail.com";
/** Local number as provided; Cyprus mobile — international dial +357. */
export const CONTACT_PHONE_DISPLAY = "96090943";
export const CONTACT_PHONE_TEL = "+35796090943";

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Artemis AI inquiry")}`;
export const CONTACT_TEL = `tel:${CONTACT_PHONE_TEL}`;

export function buildContactMailto(opts: {
  subject?: string;
  body?: string;
}): string {
  const params = new URLSearchParams();
  params.set("subject", opts.subject ?? "Artemis AI inquiry");
  if (opts.body) params.set("body", opts.body);
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MarketingHero,
  MarketingSection,
  MarketingShell,
  seoMeta,
} from "@/components/marketing/shell";
import { ContactLinks } from "@/components/relay/contact-links";
import { buildContactMailto, CONTACT_PHONE_DISPLAY, CONTACT_TEL } from "@/components/relay/contact";

export const Route = createFileRoute("/contact")({
  head: () =>
    seoMeta({
      title: "Contact | Artemis AI",
      description: "Talk to Artemis about a demo, design partnership, or rollout for your sales team.",
      path: "/contact",
    }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Contact"
        title="Talk to Artemis."
        subtitle="Book a demo, request early access, or become a design partner. Tell us about your floor and we'll respond."
      />
      <MarketingSection tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0B1B33]">Reach us directly</h2>
            <p className="mt-3 text-sm text-[#4B5C76]">
              Prefer email or phone? Use the details below — or submit the form and we'll open a
              message in your mail client.
            </p>
            <ContactLinks className="mt-5" />
            <a href={CONTACT_TEL} className="mt-4 inline-flex text-sm font-semibold text-[#12C48A]">
              Call {CONTACT_PHONE_DISPLAY}
            </a>
          </div>

          <div className="rounded-[1.75rem] border border-[#E8EEF7] bg-[#F7FAFF] p-6 sm:p-8">
            {sent ? (
              <div className="py-10 text-center">
                <p className="text-xl font-semibold text-[#0B1B33]">Thanks — your mail draft is ready.</p>
                <p className="mt-2 text-sm text-[#4B5C76]">
                  If your mail client didn't open, email us directly and we'll follow up.
                </p>
              </div>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const body = [
                    `Name: ${fd.get("name") ?? ""}`,
                    `Work email: ${fd.get("email") ?? ""}`,
                    `Company: ${fd.get("company") ?? ""}`,
                    `Team size: ${fd.get("team") ?? ""}`,
                    "",
                    String(fd.get("message") ?? ""),
                  ].join("\n");
                  window.location.href = buildContactMailto({
                    subject: "Artemis AI — Talk to Artemis",
                    body,
                  });
                  setSent(true);
                }}
              >
                <Field label="Name" name="name" required />
                <Field label="Work email" name="email" type="email" required />
                <Field label="Company" name="company" required />
                <label className="block text-sm">
                  <span className="mb-1.5 block text-[#4B5C76]">Team size</span>
                  <select
                    name="team"
                    required
                    className="w-full rounded-xl border border-[#D7E0EF] bg-white px-3 py-2.5 outline-none focus:border-[#2EE6A6]"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select team size
                    </option>
                    <option>1–10</option>
                    <option>11–50</option>
                    <option>51–200</option>
                    <option>200+</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-[#4B5C76]">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="w-full rounded-xl border border-[#D7E0EF] bg-white px-3 py-2.5 outline-none focus:border-[#2EE6A6]"
                    placeholder="Tell us about your sales floor, telephony, and goals."
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 inline-flex rounded-full bg-[#2EE6A6] px-6 py-3 text-sm font-semibold text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/30"
                >
                  Talk to Artemis
                </button>
              </form>
            )}
          </div>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-[#4B5C76]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-[#D7E0EF] bg-white px-3 py-2.5 outline-none focus:border-[#2EE6A6]"
      />
    </label>
  );
}

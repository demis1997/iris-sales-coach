import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/layout";
import { ContentCard, PageHero, Section } from "@/components/marketing/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pageHead } from "@/lib/seo";
import { track } from "@/lib/analytics";
import { saveLead } from "@/lib/leads/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book-demo")({
  head: () =>
    pageHead({
      title: "Book a Demo — Iris",
      description:
        "Book a personalised Iris demo. Tell us about your team, call volume, CRM, and main challenges.",
      path: "/book-demo",
    }),
  component: BookDemoPage,
});

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a work email"),
  company: z.string().min(2, "Enter your company"),
  title: z.string().min(2, "Enter your job title"),
  teamSize: z.string().min(1, "Select team size"),
  industry: z.string().min(1, "Select industry"),
  monthlyCalls: z.string().min(1, "Select call volume"),
  crm: z.string().min(1, "Select CRM"),
  dialer: z.string().min(1, "Select calling platform"),
  challenge: z.string().min(10, "Tell us a bit more about the challenge"),
  contactMethod: z.string().min(1, "Select preferred contact method"),
});

type FormValues = z.infer<typeof schema>;

const steps = ["About you", "Your stack", "Your challenge"] as const;

function BookDemoPage() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      title: "",
      teamSize: "",
      industry: "",
      monthlyCalls: "",
      crm: "",
      dialer: "",
      challenge: "",
      contactMethod: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    track("demo_form_started");
  }, []);

  const fieldError = (name: keyof FormValues) => form.formState.errors[name]?.message;

  async function onSubmit(values: FormValues) {
    if (submitting || submitted) return;
    setError(null);
    setSubmitting(true);
    try {
      const result = await saveLead(values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      track("demo_form_submitted", {
        industry: values.industry,
        teamSize: values.teamSize,
        duplicate: result.duplicate,
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email sales@iris.sales.");
    } finally {
      setSubmitting(false);
    }
  }

  async function nextStep() {
    const fields: (keyof FormValues)[][] = [
      ["name", "email", "company", "title", "teamSize"],
      ["industry", "monthlyCalls", "crm", "dialer"],
      ["challenge", "contactMethod"],
    ];
    const ok = await form.trigger(fields[step]);
    if (ok) setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Book a demo"
        title="See Iris on the conversations that drive your revenue"
        lede="Tell us about your team and stack. We will prepare a personalised walkthrough—no generic pitch deck marathon."
      />

      <Section>
        {submitted ? (
          <ContentCard className="mx-auto max-w-xl text-center">
            <CheckCircle2 className="mx-auto size-10 text-success" aria-hidden />
            <h2 className="mt-4 text-xl font-semibold">Request received</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Thanks—we will follow up using your preferred contact method. Your request is stored
              securely in this browser for the demo build; production will POST to your CRM or
              lead webhook.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Calendar booking is an integration point (Cal.com / Chili Piper / HubSpot meetings).
              No calendar widget is embedded until that integration is configured.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline">
                <Link to="/product">Explore the platform</Link>
              </Button>
              <Button asChild>
                <Link to="/app">View product demo</Link>
              </Button>
            </div>
          </ContentCard>
        ) : (
          <ContentCard className="mx-auto max-w-xl">
            <ol className="mb-8 flex gap-2" aria-label="Form progress">
              {steps.map((label, i) => (
                <li key={label} className="flex-1">
                  <div
                    className={cn(
                      "h-1 rounded-full",
                      i <= step ? "bg-primary" : "bg-secondary",
                    )}
                  />
                  <p
                    className={cn(
                      "mt-2 text-[11px]",
                      i === step ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </p>
                </li>
              ))}
            </ol>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {step === 0 ? (
                <>
                  <Field label="Name" error={fieldError("name")}>
                    <Input {...form.register("name")} autoComplete="name" />
                  </Field>
                  <Field label="Work email" error={fieldError("email")}>
                    <Input {...form.register("email")} type="email" autoComplete="email" />
                  </Field>
                  <Field label="Company" error={fieldError("company")}>
                    <Input {...form.register("company")} autoComplete="organization" />
                  </Field>
                  <Field label="Job title" error={fieldError("title")}>
                    <Input {...form.register("title")} autoComplete="organization-title" />
                  </Field>
                  <Field label="Team size" error={fieldError("teamSize")}>
                    <Select
                      value={form.watch("teamSize")}
                      onValueChange={(v) => form.setValue("teamSize", v, { shouldValidate: true })}
                    >
                      <SelectTrigger aria-label="Team size">
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1–5", "6–25", "26–100", "100+"].map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <Field label="Industry" error={fieldError("industry")}>
                    <Select
                      value={form.watch("industry")}
                      onValueChange={(v) => form.setValue("industry", v, { shouldValidate: true })}
                    >
                      <SelectTrigger aria-label="Industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Forex / brokerage",
                          "Financial services",
                          "Call centre",
                          "Real estate",
                          "Recruitment",
                          "Insurance",
                          "B2B SaaS",
                          "Other",
                        ].map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Monthly call volume" error={fieldError("monthlyCalls")}>
                    <Select
                      value={form.watch("monthlyCalls")}
                      onValueChange={(v) =>
                        form.setValue("monthlyCalls", v, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger aria-label="Monthly call volume">
                        <SelectValue placeholder="Select volume" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Under 500", "500–2,000", "2,000–10,000", "10,000+"].map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Current CRM" error={fieldError("crm")}>
                    <Select
                      value={form.watch("crm")}
                      onValueChange={(v) => form.setValue("crm", v, { shouldValidate: true })}
                    >
                      <SelectTrigger aria-label="Current CRM">
                        <SelectValue placeholder="Select CRM" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Salesforce",
                          "HubSpot",
                          "Pipedrive",
                          "Zoho",
                          "Dynamics",
                          "None / other",
                        ].map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Calling platform" error={fieldError("dialer")}>
                    <Select
                      value={form.watch("dialer")}
                      onValueChange={(v) => form.setValue("dialer", v, { shouldValidate: true })}
                    >
                      <SelectTrigger aria-label="Calling platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Aircall",
                          "Twilio",
                          "RingCentral",
                          "Genesys",
                          "Five9",
                          "Zoom / Teams",
                          "Other",
                        ].map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <Field label="Main challenge" error={fieldError("challenge")}>
                    <Textarea
                      {...form.register("challenge")}
                      rows={4}
                      placeholder="e.g. Managers cannot review enough calls; forecasting feels subjective; new hires ramp too slowly…"
                    />
                  </Field>
                  <Field label="Preferred contact method" error={fieldError("contactMethod")}>
                    <Select
                      value={form.watch("contactMethod")}
                      onValueChange={(v) =>
                        form.setValue("contactMethod", v, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger aria-label="Preferred contact method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Email", "Phone", "Video call"].map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </>
              ) : null}

              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={step === 0 || submitting}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  Back
                </Button>
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep}>
                    Continue
                  </Button>
                ) : (
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Submitting…
                      </>
                    ) : (
                      "Request demo"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </ContentCard>
        )}
      </Section>
    </MarketingLayout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

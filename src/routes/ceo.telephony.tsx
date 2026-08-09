import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { PageHeading } from "@/components/iris/primitives";
import { CompanyTelephonySetup } from "@/components/telephony/company-telephony-setup";
import { EmployeePhoneSetup } from "@/components/telephony/employee-phone-setup";

export const Route = createFileRoute("/ceo/telephony")({
  head: () => ({
    meta: [
      { title: "Calling setup — Artemis AI" },
      {
        name: "description",
        content: "Set company caller ID and employee handset verification for click-to-call.",
      },
    ],
  }),
  component: CeoTelephonyPage,
});

function CeoTelephonyPage() {
  return (
    <>
      <PageHeading
        title="Calling"
        subtitle="One company number for prospects. Employees only verify the phone Artemis should ring."
      />
      <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Phone className="size-3.5" />
        Click-to-call via Twilio · recordings feed the AI coaching pipeline
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <CompanyTelephonySetup />
        <EmployeePhoneSetup />
      </div>
    </>
  );
}

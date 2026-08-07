import { Mail, Phone } from "lucide-react";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_PHONE_DISPLAY,
  CONTACT_TEL,
} from "@/components/relay/contact";
import { cn } from "@/lib/utils";

export function ContactLinks({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const muted = tone === "dark" ? "text-white/65 hover:text-white" : "text-[#4B5C76] hover:text-[#12C48A]";
  const icon = tone === "dark" ? "text-[#2EE6A6]" : "text-[#12C48A]";

  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)}>
      <a href={CONTACT_MAILTO} className={cn("inline-flex items-center gap-2 font-medium transition-colors", muted)}>
        <Mail className={cn("size-4 shrink-0", icon)} aria-hidden />
        {CONTACT_EMAIL}
      </a>
      <a href={CONTACT_TEL} className={cn("inline-flex items-center gap-2 font-medium transition-colors", muted)}>
        <Phone className={cn("size-4 shrink-0", icon)} aria-hidden />
        {CONTACT_PHONE_DISPLAY}
      </a>
    </div>
  );
}

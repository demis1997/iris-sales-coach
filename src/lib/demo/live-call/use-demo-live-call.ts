import { useEffect, useState } from "react";
import { DemoCallService, type DemoCallEngineSnapshot } from "./demo-call-service";

export function useDemoLiveCall(autoStart: "midcall" | "idle" = "midcall") {
  const [service] = useState(() => new DemoCallService(autoStart === "midcall" ? "midcall" : "idle"));
  const [snap, setSnap] = useState<DemoCallEngineSnapshot>(() => service.snapshot());

  useEffect(() => {
    const unsub = service.subscribe(setSnap);
    return () => {
      unsub();
      service.destroy();
    };
  }, [service]);

  return { ...snap, service };
}

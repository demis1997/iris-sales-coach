import { analysisDatabase, processAnalysisTask } from "../src/lib/ai/analysis.server.ts";
import { setTimeout as wait } from "node:timers/promises";
if (process.env.ARTEMIS_ENABLE_PAID_AI !== "true")
  throw new Error("Explicitly enable ARTEMIS_ENABLE_PAID_AI to run provider processing");
const admin = analysisDatabase();
let stopping = false;
process.on("SIGTERM", () => {
  stopping = true;
});
process.on("SIGINT", () => {
  stopping = true;
});
while (!stopping) {
  const { data, error } = await admin.rpc("claim_analysis_task");
  if (error) {
    console.error(JSON.stringify({ event: "analysis_claim_failed" }));
    await wait(5000);
    continue;
  }
  const task = data?.[0];
  if (!task) {
    await wait(1000);
    continue;
  }
  try {
    await processAnalysisTask(task);
    console.info(JSON.stringify({ event: "analysis_completed", taskId: task.id }));
  } catch {
    const result = await admin.rpc("fail_analysis_task", {
      _task: task.id,
      _token: task.lease_token,
    });
    console.error(
      JSON.stringify({
        event: "analysis_failed",
        taskId: task.id,
        failureRecorded: !result.error && result.data === true,
      }),
    );
  }
}

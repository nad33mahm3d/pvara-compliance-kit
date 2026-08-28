import { describe, expect, it } from "vitest";
import {
  StubTfsScreeningAdapter,
  createScreeningRequest,
  getTfsScreeningChecklist,
  TFS_MODULE_WARNING,
} from "./screening.js";

describe("tfs screening", () => {
  it("returns a procedure checklist with Reg 12 citations", () => {
    const items = getTfsScreeningChecklist();
    expect(items.map((i) => i.id)).toContain("tfs-hits");
    expect(items.every((i) => i.sourceSection.length > 0)).toBe(true);
  });

  it("stub adapter returns clear results with warning", async () => {
    const adapter = new StubTfsScreeningAdapter();
    const request = createScreeningRequest({
      requestId: "req-1",
      screenedAt: "2026-08-28T00:00:00Z",
      subjects: [{ subjectId: "c1", fullName: "Test User", walletAddresses: [] }],
      listSources: ["UN"],
      context: "onboarding",
    });
    const result = await adapter.screen(request);
    expect(result.clear).toBe(true);
    expect(result.warning).toBe(TFS_MODULE_WARNING);
  });
});

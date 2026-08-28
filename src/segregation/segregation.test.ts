import { describe, expect, it } from "vitest";
import {
  createProofOfReservesDraft,
  getSegregationChecklist,
} from "./checklist.js";

describe("segregation / PoR", () => {
  it("includes s.24–27 items", () => {
    const ids = getSegregationChecklist("custody").map((i) => i.id);
    expect(ids).toContain("seg-accounts");
    expect(ids).toContain("seg-por");
    expect(ids).toContain("seg-key-management");
  });

  it("drafts a PoR record with surplus/deficit", () => {
    const draft = createProofOfReservesDraft({
      licenseeName: "Example",
      reportingPeriodEnd: "2026-06-30",
      totalCustomerLiabilities: 100,
      totalReserves: 105,
      assetUnit: "USDT",
      methodDescription: "Merkle PoR + on-chain wallet sum",
    });
    expect(draft.surplusOrDeficit).toBe(5);
  });
});

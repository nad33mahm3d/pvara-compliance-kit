import { describe, expect, it } from "vitest";
import {
  createEmptyCapitalFeeMatrix,
  isCapitalMatrixComplete,
  listFees,
  parseCapitalFeeMatrix,
} from "./matrix.js";

describe("capital / fee matrix", () => {
  it("creates empty placeholders for all 10 categories without amounts", () => {
    const matrix = createEmptyCapitalFeeMatrix();
    expect(matrix.capitalByCategory).toHaveLength(10);
    expect(isCapitalMatrixComplete(matrix)).toBe(false);
    expect(matrix.warning).toMatch(/official PVARA/i);
  });

  it("parses a caller-supplied fee schedule", () => {
    const matrix = parseCapitalFeeMatrix({
      asOfDate: "2026-08-28",
      disclaimer: "x",
      warning: "y",
      capitalByCategory: [
        {
          categoryId: "exchange",
          minimumPaidUpCapital: {
            amount: 1,
            currency: "PKR",
            scheduleAsOf: "2026-08-01",
            sourceCitation: "PVARA fee schedule (caller-verified)",
          },
        },
      ],
      fees: [
        {
          feeId: "noc-app",
          label: "NOC application fee",
          appliesTo: "noc_application",
          amount: {
            amount: 1,
            currency: "PKR",
            scheduleAsOf: "2026-08-01",
            sourceCitation: "PVARA fee schedule (caller-verified)",
          },
          refundable: false,
        },
      ],
    });
    expect(listFees(matrix, "noc_application")).toHaveLength(1);
  });
});

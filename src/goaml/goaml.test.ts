import { describe, expect, it } from "vitest";
import { formatCtrReport, formatIsarReport, formatStrReport } from "./format.js";
import { GOAML_MODULE_WARNING } from "./report-schema.js";

describe("goaml format helpers", () => {
  it("formats a valid STR and includes best-effort warning", () => {
    const result = formatStrReport({
      reportType: "STR",
      reportingEntityName: "Example VASP",
      mlroName: "A. MLRO",
      suspicionSummary: "Layering via multiple wallets",
      parties: [{ name: "Customer A", accountOrWallet: "0x1" }],
      supportingNarrative: "See case file.",
      indicators: ["rapid movement"],
    });
    expect(result.ok).toBe(true);
    expect(result.warning).toBe(GOAML_MODULE_WARNING);
    expect(result.data?.reportType).toBe("STR");
  });

  it("formats CTR with caller-supplied threshold field", () => {
    const result = formatCtrReport({
      reportType: "CTR",
      reportingEntityName: "Example VASP",
      transactionDate: "2026-08-01",
      transactionAmount: 2_000_000,
      currency: "PKR",
      applicableThreshold: 0,
      parties: [{ name: "Customer B" }],
    });
    expect(result.ok).toBe(true);
  });

  it("formats ISAR for internal escalation", () => {
    const result = formatIsarReport({
      reportType: "ISAR",
      raisedBy: "Analyst 1",
      raisedAt: "2026-08-01T10:00:00Z",
      customerOrCounterparty: "Customer C",
      activityDescription: "Unusual deposit pattern",
      mlroDecision: "pending_review",
    });
    expect(result.ok).toBe(true);
  });

  it("returns errors for incomplete STR", () => {
    const result = formatStrReport({ reportType: "STR" });
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from "vitest";
import { validateTravelRulePayload } from "./validate.js";

const validPayload = {
  originator: {
    name: { primaryIdentifier: "Ali", secondaryIdentifier: "Khan" },
    accountNumber: "0xabc123",
    geographicAddress: { country: "PK", townName: "Karachi" },
  },
  beneficiary: {
    name: { primaryIdentifier: "Sara", secondaryIdentifier: "Ahmed" },
    accountNumber: "0xdef456",
  },
  originatingVasp: { legalPersonName: "Example Exchange PK" },
};

describe("validateTravelRulePayload", () => {
  it("validates a well-formed payload and flags above-threshold", () => {
    const result = validateTravelRulePayload(validPayload, 600_000, 500_000);
    expect(result.valid).toBe(true);
    expect(result.aboveThreshold).toBe(true);
    expect(result.thresholdApplies).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("flags below-threshold transfers without inventing a permanent threshold", () => {
    const result = validateTravelRulePayload(validPayload, 100, 500_000);
    expect(result.valid).toBe(true);
    expect(result.aboveThreshold).toBe(false);
    expect(result.thresholdApplies).toBe(false);
  });

  it("returns field errors for incomplete payload", () => {
    const result = validateTravelRulePayload(
      { originator: { name: { primaryIdentifier: "" }, accountNumber: "" } },
      1,
      1,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects invalid threshold input", () => {
    const result = validateTravelRulePayload(validPayload, 100, Number.NaN);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/threshold/);
  });
});

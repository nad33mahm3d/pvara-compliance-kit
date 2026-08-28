import { describe, expect, it } from "vitest";
import { validateCnic } from "./cnic.js";
import { entityKycSchema, individualKycSchema } from "./schema.js";

describe("validateCnic", () => {
  it("accepts formatted CNIC", () => {
    const r = validateCnic("42101-1234567-1");
    expect(r.valid).toBe(true);
    expect(r.normalized).toBe("4210112345671");
  });

  it("accepts 13-digit CNIC and formats it", () => {
    const r = validateCnic("4210112345671");
    expect(r.valid).toBe(true);
    expect(r.formatted).toBe("42101-1234567-1");
  });

  it("rejects invalid formats", () => {
    expect(validateCnic("123").valid).toBe(false);
    expect(validateCnic("").valid).toBe(false);
  });
});

describe("kyc schemas", () => {
  it("parses individual KYC", () => {
    const parsed = individualKycSchema.parse({
      fullName: "Ali Khan",
      cnic: "42101-1234567-1",
      dateOfBirth: "1990-01-01",
      nationality: "PK",
      address: {
        line1: "Street 1",
        city: "Karachi",
        country: "PK",
      },
      sourceOfFunds: "Employment",
      pep: { isPep: false },
      riskRating: "low",
    });
    expect(parsed.fullName).toBe("Ali Khan");
  });

  it("requires beneficial owners for entities", () => {
    expect(() =>
      entityKycSchema.parse({
        legalName: "Example (Pvt) Ltd",
        registrationNumber: "123456",
        jurisdictionOfIncorporation: "PK",
        registeredAddress: {
          line1: "Plot 1",
          city: "Islamabad",
          country: "PK",
        },
        sourceOfFunds: "Share capital",
        riskRating: "medium",
        beneficialOwners: [],
      }),
    ).toThrow();
  });
});

import { describe, expect, it } from "vitest";
import {
  createWhitepaperOutline,
  getArtChecklist,
  getFrtChecklist,
  getIssuanceChecklistForKind,
} from "./token.js";

describe("issuance", () => {
  it("FRT checklist includes Section 31 reserve items", () => {
    const ids = getFrtChecklist().map((i) => i.id);
    expect(ids).toContain("frt-reserves");
    expect(ids).toContain("iss-whitepaper");
  });

  it("ART checklist includes no-VA-backing item", () => {
    expect(getArtChecklist().map((i) => i.id)).toContain("art-no-va-backing");
  });

  it("selects checklist by kind", () => {
    expect(getIssuanceChecklistForKind("frt").some((i) => i.id === "frt-redemption")).toBe(
      true,
    );
  });

  it("builds whitepaper outline", () => {
    const wp = createWhitepaperOutline({
      tokenName: "PKR Soft",
      issuerLegalName: "Issuer PK",
      issuanceKind: "frt",
      summaryOfRights: "Redeemable at par for PKR",
      technologyOverview: "ERC-20 on permissioned chain",
      riskDisclosures: "Not legal tender; issuer risk",
      marketingRestrictionsAcknowledged: true,
    });
    expect(wp.issuanceKind).toBe("frt");
  });
});

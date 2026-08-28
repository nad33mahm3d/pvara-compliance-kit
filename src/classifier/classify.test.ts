import { describe, expect, it } from "vitest";
import { AML_REGISTERED_CATEGORY_IDS, LICENSE_CATEGORIES } from "./categories.js";
import { classify } from "./classify.js";

describe("LICENSE_CATEGORIES", () => {
  it("encodes exactly 10 Schedule I categories", () => {
    expect(LICENSE_CATEGORIES).toHaveLength(10);
  });

  it("marks only four categories as AML-Registered eligible", () => {
    expect(AML_REGISTERED_CATEGORY_IDS).toEqual([
      "broker_dealer",
      "custody",
      "exchange",
      "derivatives",
    ]);
    const flagged = LICENSE_CATEGORIES.filter((c) => c.amlRegisteredEligible).map(
      (c) => c.id,
    );
    expect(flagged.sort()).toEqual([...AML_REGISTERED_CATEGORY_IDS].sort());
  });
});

describe("classify", () => {
  it("classifies a typical exchange + custody profile", () => {
    const out = classify({
      operatesExchangeOrOrderBook: "yes",
      holdsCustomerKeysOrAssets: "yes",
      selfCustodyOnly: "no",
    });
    const ids = out.results.map((r) => r.category.id);
    expect(ids).toContain("exchange");
    expect(ids).toContain("custody");
    expect(out.results.find((r) => r.category.id === "exchange")?.amlRegisteredEligible).toBe(
      true,
    );
    expect(out.disclaimer.length).toBeGreaterThan(0);
  });

  it("applies self-custody exemption and does not hit custody", () => {
    const out = classify({
      selfCustodyOnly: "yes",
      holdsCustomerKeysOrAssets: "no",
    });
    expect(out.results.map((r) => r.category.id)).not.toContain("custody");
    expect(out.exemptionsApplied.some((e) => /self-custody/i.test(e))).toBe(true);
  });

  it("applies proprietary trading exemption", () => {
    const out = classify({
      proprietaryTradingOnly: "yes",
      arrangesOrFacilitatesOrders: "no",
      holdsCustomerKeysOrAssets: "no",
    });
    expect(out.results.map((r) => r.category.id)).not.toContain("broker_dealer");
    expect(out.exemptionsApplied.some((e) => /proprietary trading/i.test(e))).toBe(true);
  });

  it("applies pure own-account mining exemption", () => {
    const out = classify({
      pureOwnAccountMining: "yes",
      miningServicesForThirdParties: "no",
    });
    expect(out.results).toHaveLength(0);
    expect(out.exemptionsApplied.some((e) => /own account/i.test(e))).toBe(true);
  });

  it("applies general education exemption for advisory", () => {
    const out = classify({
      generalEducationOnly: "yes",
      providesPersonalisedAdvice: "no",
    });
    expect(out.results.map((r) => r.category.id)).not.toContain("advisory");
  });

  it("ranks multiple hits by score", () => {
    const out = classify({
      operatesExchangeOrOrderBook: "yes",
      offersDerivatives: "yes",
      issuesOrAdministersToken: "yes",
    });
    expect(out.results[0]?.rank).toBe(1);
    expect(out.results.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it("includes reasoning trails", () => {
    const out = classify({ facilitatesLendingOrBorrowing: "yes" });
    expect(out.results[0]?.reasoningTrail.length).toBeGreaterThan(0);
  });
});

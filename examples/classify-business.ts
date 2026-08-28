/**
 * Example: classify a structured business profile into Schedule I categories.
 *
 * Run from repo root after build:
 *   npx tsx examples/classify-business.ts
 */

import { classify, LEGAL_DISCLAIMER } from "../src/index.js";

console.log(LEGAL_DISCLAIMER);
console.log("");

const result = classify({
  operatesExchangeOrOrderBook: "yes",
  holdsCustomerKeysOrAssets: "yes",
  selfCustodyOnly: "no",
  arrangesOrFacilitatesOrders: "no",
  offersDerivatives: "no",
});

console.log("Exemptions:", result.exemptionsApplied);
console.log("Likely categories:");
for (const r of result.results) {
  console.log(
    `  #${r.rank} ${r.category.label} (amlRegisteredEligible=${r.amlRegisteredEligible})`,
  );
  for (const reason of r.reasoningTrail) {
    console.log(`      - ${reason}`);
  }
}

/**
 * Example: validate a Travel Rule payload with a caller-supplied threshold.
 *
 * The threshold must come from current PVARA prescription — do not treat
 * example numbers as law.
 *
 * Run: npx tsx examples/validate-travel-rule-payload.ts
 */

import { LEGAL_DISCLAIMER, validateTravelRulePayload } from "../src/index.js";

console.log(LEGAL_DISCLAIMER);
console.log("");

/** Example only — replace with the current PVARA-prescribed threshold after verification. */
const EXAMPLE_THRESHOLD_PKR = 500_000;

const payload = {
  originator: {
    name: { primaryIdentifier: "Ali", secondaryIdentifier: "Khan" },
    accountNumber: "0xabc123",
    geographicAddress: { country: "PK", townName: "Karachi", addressLine: ["Street 1"] },
  },
  beneficiary: {
    name: { primaryIdentifier: "Sara", secondaryIdentifier: "Ahmed" },
    accountNumber: "0xdef456",
  },
  originatingVasp: { legalPersonName: "Example Exchange (Pvt) Ltd" },
};

const result = validateTravelRulePayload(payload, 750_000, EXAMPLE_THRESHOLD_PKR);
console.log(JSON.stringify(result, null, 2));

/**
 * Travel Rule module — FATF R.16 / Section 47 aligned payload validation.
 * Not legal advice. Thresholds are caller-configured. See DISCLAIMER.md.
 */

export {
  travelRulePayloadSchema,
  personNameSchema,
  geographicAddressSchema,
  originatorPersonSchema,
  beneficiaryPersonSchema,
  vaspInfoSchema,
  type TravelRulePayload,
  type OriginatorPerson,
  type BeneficiaryPerson,
} from "./schema.js";

export {
  validateTravelRulePayload,
  parseTravelRulePayload,
  LEGAL_DISCLAIMER,
  type TravelRuleValidationResult,
} from "./validate.js";

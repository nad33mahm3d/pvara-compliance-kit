/**
 * KYC module — CDD data shapes and CNIC format checks.
 * Does not perform identity verification. See DISCLAIMER.md.
 */

import { LEGAL_DISCLAIMER } from "../types.js";

export { LEGAL_DISCLAIMER };

export {
  individualKycSchema,
  entityKycSchema,
  kycRecordSchema,
  riskRatingSchema,
  pepStatusSchema,
  addressSchema,
  beneficialOwnerSchema,
  type IndividualKyc,
  type EntityKyc,
  type KycRecord,
  type RiskRating,
} from "./schema.js";

export { validateCnic, type CnicValidationResult } from "./cnic.js";

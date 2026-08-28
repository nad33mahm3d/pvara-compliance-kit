/**
 * Capital / fee matrix module — caller-supplied official schedule values only.
 * See DISCLAIMER.md.
 */

export {
  CAPITAL_FEE_MODULE_WARNING,
  moneyAmountSchema,
  categoryCapitalRequirementSchema,
  feeScheduleEntrySchema,
  capitalFeeMatrixSchema,
  createEmptyCapitalFeeMatrix,
  parseCapitalFeeMatrix,
  getCapitalRequirement,
  listFees,
  isCapitalMatrixComplete,
  LEGAL_DISCLAIMER,
  type MoneyAmount,
  type CategoryCapitalRequirement,
  type FeeScheduleEntry,
  type CapitalFeeMatrix,
} from "./matrix.js";

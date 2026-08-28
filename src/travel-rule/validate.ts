/**
 * Travel Rule validation + threshold check helpers (Act Section 47).
 * Threshold is always a caller-supplied parameter. See DISCLAIMER.md.
 */

import { LEGAL_DISCLAIMER } from "../types.js";
import {
  travelRulePayloadSchema,
  type TravelRulePayload,
} from "./schema.js";

export { LEGAL_DISCLAIMER };

export interface TravelRuleValidationResult {
  valid: boolean;
  errors: string[];
  /** True when transferAmount >= threshold (both in the same currency units as supplied). */
  aboveThreshold: boolean;
  transferAmount: number;
  threshold: number;
  disclaimer: string;
  /**
   * When below threshold, payload validation is still reported but Section 47
   * obtain/hold/transmit obligations may not apply — confirm with current PVARA rules.
   */
  thresholdApplies: boolean;
}

/**
 * Validate a Travel Rule payload and whether the transfer meets/exceeds the
 * PVARA-prescribed threshold (passed in by the caller — not hardcoded).
 *
 * @param payload - Originator/beneficiary data
 * @param transferAmount - Transfer amount in the same units as `threshold`
 * @param threshold - Authority-prescribed threshold; verify current value before use
 */
export function validateTravelRulePayload(
  payload: unknown,
  transferAmount: number,
  threshold: number,
): TravelRuleValidationResult {
  if (!Number.isFinite(transferAmount) || transferAmount < 0) {
    return {
      valid: false,
      errors: ["transferAmount must be a non-negative finite number"],
      aboveThreshold: false,
      transferAmount,
      threshold,
      disclaimer: LEGAL_DISCLAIMER,
      thresholdApplies: false,
    };
  }
  if (!Number.isFinite(threshold) || threshold < 0) {
    return {
      valid: false,
      errors: [
        "threshold must be a non-negative finite number supplied by the caller (verify current PVARA prescription)",
      ],
      aboveThreshold: false,
      transferAmount,
      threshold,
      disclaimer: LEGAL_DISCLAIMER,
      thresholdApplies: false,
    };
  }

  const aboveThreshold = transferAmount >= threshold;
  const parsed = travelRulePayloadSchema.safeParse(payload);
  const errors: string[] = [];

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push(`${issue.path.join(".") || "payload"}: ${issue.message}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    aboveThreshold,
    transferAmount,
    threshold,
    disclaimer: LEGAL_DISCLAIMER,
    thresholdApplies: aboveThreshold,
    ...(parsed.success ? {} : {}),
  };
}

/** Type guard helper after successful validation. */
export function parseTravelRulePayload(payload: unknown): TravelRulePayload {
  return travelRulePayloadSchema.parse(payload);
}

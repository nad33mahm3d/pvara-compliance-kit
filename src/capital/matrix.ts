/**
 * Capital and fee matrices — caller-supplied values only.
 *
 * Never hardcodes authoritative PKR amounts. Consumers inject the current
 * PVARA schedule after verification. See DISCLAIMER.md.
 */

import { z } from "zod";
import {
  CITATION_AS_OF,
  LEGAL_DISCLAIMER,
  type LicenseCategoryId,
} from "../types.js";
import { LICENSE_CATEGORIES } from "../classifier/categories.js";

export { LEGAL_DISCLAIMER };

export const CAPITAL_FEE_MODULE_WARNING =
  "Capital and fee figures must be supplied from the current official PVARA fee/capital schedule. " +
  "This module stores and validates caller-provided matrices only — it does not publish authoritative amounts.";

export const moneyAmountSchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().min(1).default("PKR"),
  /** ISO date of the official schedule this amount was taken from. */
  scheduleAsOf: z.string().min(1),
  sourceCitation: z.string().min(1),
});

export type MoneyAmount = z.infer<typeof moneyAmountSchema>;

export const categoryCapitalRequirementSchema = z.object({
  categoryId: z.string(),
  minimumPaidUpCapital: moneyAmountSchema.optional(),
  minimumLiquidAssets: moneyAmountSchema.optional(),
  notes: z.string().optional(),
});

export const feeScheduleEntrySchema = z.object({
  feeId: z.string().min(1),
  label: z.string().min(1),
  appliesTo: z.enum([
    "noc_application",
    "licence_application",
    "annual_licence",
    "variation",
    "other",
  ]),
  categoryId: z.string().optional(),
  amount: moneyAmountSchema,
  refundable: z.boolean().default(false),
});

export const capitalFeeMatrixSchema = z.object({
  asOfDate: z.string(),
  disclaimer: z.string(),
  warning: z.string(),
  capitalByCategory: z.array(categoryCapitalRequirementSchema).default([]),
  fees: z.array(feeScheduleEntrySchema).default([]),
});

export type CategoryCapitalRequirement = z.infer<
  typeof categoryCapitalRequirementSchema
>;
export type FeeScheduleEntry = z.infer<typeof feeScheduleEntrySchema>;
export type CapitalFeeMatrix = z.infer<typeof capitalFeeMatrixSchema>;

/**
 * Empty matrix template with one placeholder row per Schedule I category.
 * Amounts are omitted until the caller fills them from official schedules.
 */
export function createEmptyCapitalFeeMatrix(
  asOfDate: string = CITATION_AS_OF,
): CapitalFeeMatrix {
  return capitalFeeMatrixSchema.parse({
    asOfDate,
    disclaimer: LEGAL_DISCLAIMER,
    warning: CAPITAL_FEE_MODULE_WARNING,
    capitalByCategory: LICENSE_CATEGORIES.map((c) => ({
      categoryId: c.id,
      notes: "Fill minimumPaidUpCapital / minimumLiquidAssets from current PVARA schedule.",
    })),
    fees: [],
  });
}

/**
 * Validate and normalise a caller-supplied matrix (e.g. loaded from JSON config).
 */
export function parseCapitalFeeMatrix(input: unknown): CapitalFeeMatrix {
  const parsed = capitalFeeMatrixSchema.parse(input);
  return {
    ...parsed,
    disclaimer: LEGAL_DISCLAIMER,
    warning: CAPITAL_FEE_MODULE_WARNING,
  };
}

export function getCapitalRequirement(
  matrix: CapitalFeeMatrix,
  categoryId: LicenseCategoryId,
): CategoryCapitalRequirement | undefined {
  return matrix.capitalByCategory.find((c) => c.categoryId === categoryId);
}

export function listFees(
  matrix: CapitalFeeMatrix,
  appliesTo?: FeeScheduleEntry["appliesTo"],
): FeeScheduleEntry[] {
  if (!appliesTo) return matrix.fees;
  return matrix.fees.filter((f) => f.appliesTo === appliesTo);
}

/**
 * Returns true only when every category has at least one capital amount filled.
 * Useful to detect incomplete config before go-live.
 */
export function isCapitalMatrixComplete(matrix: CapitalFeeMatrix): boolean {
  if (matrix.capitalByCategory.length < LICENSE_CATEGORIES.length) return false;
  return matrix.capitalByCategory.every(
    (c) => c.minimumPaidUpCapital !== undefined || c.minimumLiquidAssets !== undefined,
  );
}

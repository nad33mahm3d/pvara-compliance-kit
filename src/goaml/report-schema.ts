/**
 * Best-effort goAML-oriented report shapes (FMU).
 *
 * LEAST CERTAIN MODULE in this toolkit. Not official FMU XML schemas.
 * Does not submit reports. Adapt to current FMU goAML guidance.
 * See DISCLAIMER.md.
 */

import { z } from "zod";

export const GOAML_MODULE_WARNING =
  "BEST-EFFORT ONLY: goAML report shapes in pvara-compliance-kit are not official FMU schemas, " +
  "do not generate submission-ready XML, and must be adapted to current FMU goAML requirements. " +
  "This module does not file STRs or CTRs.";

const partySchema = z.object({
  name: z.string().min(1),
  accountOrWallet: z.string().optional(),
  cnicOrRegistration: z.string().optional(),
  nationalityOrJurisdiction: z.string().optional(),
  address: z.string().optional(),
});

/**
 * Suspicious Transaction Report — structure only.
 */
export const strReportSchema = z.object({
  reportType: z.literal("STR"),
  reportingEntityName: z.string().min(1),
  mlroName: z.string().min(1),
  submissionReference: z.string().optional(),
  suspicionSummary: z.string().min(1),
  indicators: z.array(z.string()).default([]),
  transactionDate: z.string().optional(),
  transactionAmount: z.number().optional(),
  currencyOrAsset: z.string().optional(),
  parties: z.array(partySchema).min(1),
  supportingNarrative: z.string().min(1),
  internalCaseId: z.string().optional(),
});

/**
 * Currency Transaction Report for fiat transactions at/above the applicable threshold
 * (threshold is set by authorities — not hardcoded here).
 */
export const ctrReportSchema = z.object({
  reportType: z.literal("CTR"),
  reportingEntityName: z.string().min(1),
  transactionDate: z.string().min(1),
  transactionAmount: z.number().positive(),
  currency: z.string().min(1),
  /** Caller-supplied CTR threshold used for internal gating — verify current FMU/PVARA value. */
  applicableThreshold: z.number().nonnegative(),
  parties: z.array(partySchema).min(1),
  transactionDescription: z.string().optional(),
  branchOrChannel: z.string().optional(),
});

/**
 * Internal Suspicious Activity Report aligned conceptually with NOC Form A7.
 */
export const isarReportSchema = z.object({
  reportType: z.literal("ISAR"),
  raisedBy: z.string().min(1),
  raisedAt: z.string().min(1),
  customerOrCounterparty: z.string().min(1),
  activityDescription: z.string().min(1),
  amountInvolved: z.number().optional(),
  assetOrCurrency: z.string().optional(),
  mlroDecision: z.enum(["escalate_to_str", "no_str", "pending_review"]).optional(),
  mlroNotes: z.string().optional(),
  linkedTransactionIds: z.array(z.string()).default([]),
});

export const goamlReportSchema = z.discriminatedUnion("reportType", [
  strReportSchema,
  ctrReportSchema,
  isarReportSchema,
]);

export type StrReport = z.infer<typeof strReportSchema>;
export type CtrReport = z.infer<typeof ctrReportSchema>;
export type IsarReport = z.infer<typeof isarReportSchema>;
export type GoamlReport = z.infer<typeof goamlReportSchema>;

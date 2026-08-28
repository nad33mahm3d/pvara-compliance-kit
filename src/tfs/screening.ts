/**
 * TFS / sanctions screening integration interfaces.
 *
 * Provides types and a pluggable adapter contract — does not ship list data
 * or perform live screening. See DISCLAIMER.md.
 */

import { z } from "zod";
import {
  CITATION_AS_OF,
  LEGAL_DISCLAIMER,
  type ChecklistItem,
  type ChecklistItemStatus,
} from "../types.js";

export { LEGAL_DISCLAIMER };

export const TFS_MODULE_WARNING =
  "TFS module provides integration interfaces and procedure checklists only. " +
  "It does not contain sanctions list data, does not screen parties, and is not a substitute " +
  "for an approved TFS screening system under NOC Reg 8.2 / Reg 12.";

export const screeningSubjectSchema = z.object({
  subjectId: z.string().min(1),
  fullName: z.string().min(1),
  dateOfBirth: z.string().optional(),
  nationality: z.string().length(2).optional(),
  cnic: z.string().optional(),
  passportNumber: z.string().optional(),
  walletAddresses: z.array(z.string()).default([]),
  entityName: z.string().optional(),
  registrationNumber: z.string().optional(),
});

export const screeningRequestSchema = z.object({
  requestId: z.string().min(1),
  screenedAt: z.string().min(1),
  subjects: z.array(screeningSubjectSchema).min(1),
  /** Caller-defined list sources / provider ids — not embedded in this kit. */
  listSources: z.array(z.string()).default([]),
  context: z
    .enum(["onboarding", "periodic_refresh", "pre_transaction", "ongoing_monitoring"])
    .optional(),
});

export const screeningMatchSchema = z.object({
  subjectId: z.string(),
  listSource: z.string(),
  matchScore: z.number().min(0).max(1).optional(),
  matchedName: z.string().optional(),
  reason: z.string().optional(),
});

export const screeningResultSchema = z.object({
  requestId: z.string(),
  screenedAt: z.string(),
  clear: z.boolean(),
  matches: z.array(screeningMatchSchema).default([]),
  provider: z.string().optional(),
  rawReference: z.string().optional(),
  warning: z.literal(TFS_MODULE_WARNING).or(z.string()).optional(),
});

export type ScreeningSubject = z.infer<typeof screeningSubjectSchema>;
export type ScreeningRequest = z.infer<typeof screeningRequestSchema>;
export type ScreeningMatch = z.infer<typeof screeningMatchSchema>;
export type ScreeningResult = z.infer<typeof screeningResultSchema>;

/**
 * Pluggable adapter — implement against your screening vendor or internal engine.
 */
export interface TfsScreeningAdapter {
  readonly name: string;
  screen(request: ScreeningRequest): Promise<ScreeningResult>;
}

/**
 * In-memory stub adapter for tests / wiring demos. Always returns clear=true.
 * Do not use in production.
 */
export class StubTfsScreeningAdapter implements TfsScreeningAdapter {
  readonly name = "stub-clear-always";

  async screen(request: ScreeningRequest): Promise<ScreeningResult> {
    const parsed = screeningRequestSchema.parse(request);
    return {
      requestId: parsed.requestId,
      screenedAt: parsed.screenedAt,
      clear: true,
      matches: [],
      provider: this.name,
      warning: TFS_MODULE_WARNING,
    };
  }
}

function item(
  partial: Omit<ChecklistItem, "status" | "asOfDate"> & {
    status?: ChecklistItemStatus;
  },
): ChecklistItem {
  return { status: "not_started", asOfDate: CITATION_AS_OF, ...partial };
}

/**
 * Procedure checklist for TFS / sanctions controls (NOC Reg 8.2 / Reg 12).
 */
export function getTfsScreeningChecklist(): ChecklistItem[] {
  return [
    item({
      id: "tfs-policy",
      section: "Governance",
      label: "Board-approved TFS / sanctions policy",
      description:
        "Documented Targeted Financial Sanctions and sanctions screening policy approved by the board.",
      required: true,
      sourceInstrument: "noc_regulations",
      sourceSection: "NOC Reg 8.2 / Reg 12",
      confidence: "regulation",
    }),
    item({
      id: "tfs-lists",
      section: "Lists",
      label: "Applicable list sources identified",
      description:
        "Identify and maintain applicable UN, domestic, and other prescribed TFS/sanctions lists. List content is outside this toolkit.",
      required: true,
      sourceInstrument: "noc_regulations",
      sourceSection: "NOC Reg 12",
      confidence: "regulation",
    }),
    item({
      id: "tfs-onboarding",
      section: "Controls",
      label: "Screen customers and UBOs at onboarding",
      description:
        "Screen customers, beneficial owners, and relevant counterparties before establishing a business relationship.",
      required: true,
      sourceInstrument: "noc_regulations",
      sourceSection: "NOC Reg 12",
      confidence: "regulation",
    }),
    item({
      id: "tfs-ongoing",
      section: "Controls",
      label: "Ongoing / event-driven re-screening",
      description:
        "Re-screen on list updates, periodic refresh, and pre-transaction triggers as defined in policy.",
      required: true,
      sourceInstrument: "noc_regulations",
      sourceSection: "NOC Reg 12",
      confidence: "regulation",
    }),
    item({
      id: "tfs-hits",
      section: "Escalation",
      label: "True-positive hit escalation and freeze/reporting playbook",
      description:
        "Document escalation to Compliance/MLRO, asset freeze where required, and reporting to competent authorities.",
      required: true,
      sourceInstrument: "noc_regulations",
      sourceSection: "NOC Reg 12",
      confidence: "regulation",
    }),
    item({
      id: "tfs-records",
      section: "Records",
      label: "Retain screening logs and dispositions",
      description:
        "Keep screening requests, matches, false-positive dispositions, and escalation outcomes for the prescribed retention period.",
      required: true,
      sourceInstrument: "noc_regulations",
      sourceSection: "NOC Reg 12 / Section 47(4)",
      confidence: "regulation",
    }),
    item({
      id: "tfs-adapter",
      section: "Technology",
      label: "Wire a production TfsScreeningAdapter",
      description:
        "Integrate a real screening provider implementing TfsScreeningAdapter. The stub adapter is for demos only.",
      required: true,
      sourceInstrument: "best_effort",
      sourceSection: "Implementation guidance",
      confidence: "best_effort",
    }),
  ];
}

export function createScreeningRequest(
  partial: Omit<ScreeningRequest, "subjects"> & {
    subjects: ScreeningSubject[];
  },
): ScreeningRequest {
  return screeningRequestSchema.parse(partial);
}

/**
 * Shared types for pvara-compliance-kit.
 *
 * This toolkit structures compliance work. It does not certify compliance
 * or replace legal counsel. See DISCLAIMER.md.
 */

/** Short legal notice to surface in docs and consumer UIs. */
export const LEGAL_DISCLAIMER =
  "pvara-compliance-kit is a structuring toolkit, not legal advice. " +
  "It is not affiliated with or endorsed by PVARA. Verify all requirements " +
  "against current official regulations and consult qualified legal counsel " +
  "before relying on this software for licensing or AML/CFT decisions.";

/** Snapshot date used for v1 citation metadata (ISO). Update when sources are refreshed. */
export const CITATION_AS_OF = "2026-08-28";

export type SourceInstrument =
  | "act"
  | "noc_regulations"
  | "schedule_i"
  | "fatf"
  | "best_effort";

export type CitationConfidence = "statutory" | "regulation" | "best_effort";

export interface Citation {
  sourceInstrument: SourceInstrument;
  sourceSection: string;
  asOfDate: string;
  confidence: CitationConfidence;
}

export type ChecklistItemStatus = "not_started" | "in_progress" | "complete";

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
  sourceSection: string;
  sourceInstrument: SourceInstrument;
  asOfDate: string;
  confidence: CitationConfidence;
  status: ChecklistItemStatus;
  section?: string;
}

export type LicenseCategoryId =
  | "advisory"
  | "broker_dealer"
  | "custody"
  | "exchange"
  | "lending_borrowing"
  | "derivatives"
  | "asset_management"
  | "transfer_settlement"
  | "issuance"
  | "mining_related";

export function citation(
  sourceInstrument: SourceInstrument,
  sourceSection: string,
  confidence: CitationConfidence,
  asOfDate: string = CITATION_AS_OF,
): Citation {
  return { sourceInstrument, sourceSection, asOfDate, confidence };
}

/**
 * Regulatory sandbox and no-action letter pathway helpers (Act Section 35).
 * Structuring aid — not an application portal. See DISCLAIMER.md.
 */

import {
  CITATION_AS_OF,
  LEGAL_DISCLAIMER,
  type ChecklistItem,
  type ChecklistItemStatus,
} from "../types.js";

export { LEGAL_DISCLAIMER };

export type PathwayKind = "noc_licence" | "sandbox" | "no_action_letter";

export interface PathwayAssessmentInput {
  /** Novel / innovative product that may not fit standard licence categories cleanly. */
  novelOrPilotModel: boolean;
  /** Seeking supervised live testing under sandbox guidelines. */
  seeksSupervisedLiveTesting: boolean;
  /** Seeking comfort for a narrow pilot without full licence (no-action). */
  seeksNoActionComfort: boolean;
  /** Standard VASP services clearly within Schedule I. */
  standardScheduleIServices: boolean;
}

export interface PathwayRecommendation {
  primary: PathwayKind;
  alternatives: PathwayKind[];
  reasoning: string[];
  disclaimer: string;
  sourceSection: string;
}

/**
 * Recommend an entry pathway based on structured flags.
 * Deterministic heuristic only — not a PVARA determination.
 */
export function recommendPathway(
  input: PathwayAssessmentInput,
): PathwayRecommendation {
  const reasoning: string[] = [];
  let primary: PathwayKind = "noc_licence";
  const alternatives: PathwayKind[] = [];

  if (input.standardScheduleIServices && !input.novelOrPilotModel) {
    primary = "noc_licence";
    reasoning.push(
      "Standard Schedule I services — default path is NOC then full licence (Sections 19 / 21).",
    );
  }

  if (input.novelOrPilotModel && input.seeksSupervisedLiveTesting) {
    primary = "sandbox";
    reasoning.push(
      "Novel/pilot model seeking supervised live testing — consider Regulatory Sandbox under Section 35 (and Sandbox Guidelines).",
    );
    alternatives.push("noc_licence");
  } else if (input.novelOrPilotModel && input.seeksNoActionComfort) {
    primary = "no_action_letter";
    reasoning.push(
      "Novel/pilot model seeking limited comfort — consider no-action letter route under Section 35(3) where available; verify current PVARA practice.",
    );
    alternatives.push("sandbox", "noc_licence");
  } else if (input.novelOrPilotModel) {
    primary = "sandbox";
    reasoning.push(
      "Novel/pilot model flagged — sandbox may be appropriate; otherwise proceed via NOC/licence if services map to Schedule I.",
    );
    alternatives.push("noc_licence", "no_action_letter");
  }

  if (input.seeksSupervisedLiveTesting && primary !== "sandbox") {
    alternatives.push("sandbox");
  }
  if (input.seeksNoActionComfort && primary !== "no_action_letter") {
    alternatives.push("no_action_letter");
  }

  return {
    primary,
    alternatives: [...new Set(alternatives)],
    reasoning,
    disclaimer: LEGAL_DISCLAIMER,
    sourceSection: "Section 35",
  };
}

function item(
  partial: Omit<ChecklistItem, "status" | "asOfDate"> & {
    status?: ChecklistItemStatus;
  },
): ChecklistItem {
  return { status: "not_started", asOfDate: CITATION_AS_OF, ...partial };
}

export function getSandboxChecklist(): ChecklistItem[] {
  return [
    item({
      id: "sbx-eligibility",
      section: "Sandbox",
      label: "Confirm sandbox eligibility narrative",
      description:
        "Document why the product is novel, the testing objectives, and why supervised live testing is needed under Section 35 / Sandbox Guidelines.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 35",
      confidence: "statutory",
    }),
    item({
      id: "sbx-scope",
      section: "Sandbox",
      label: "Define test scope, limits, and duration",
      description:
        "Propose customer limits, volume caps, geographies, and test period consistent with PVARA Sandbox Guidelines.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 35",
      confidence: "best_effort",
    }),
    item({
      id: "sbx-consumer",
      section: "Sandbox",
      label: "Consumer protection and disclosure plan",
      description:
        "Risk disclosures, complaint handling, and exit/wind-down plan for sandbox participants.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 35",
      confidence: "best_effort",
    }),
    item({
      id: "sbx-aml",
      section: "Sandbox",
      label: "AML/CFT controls during testing",
      description:
        "Maintain proportionate AML/CFT/CPF controls during sandbox testing; sandbox is not an AML holiday.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 35 / Section 46",
      confidence: "statutory",
    }),
    item({
      id: "sbx-reporting",
      section: "Sandbox",
      label: "Sandbox reporting cadence to PVARA",
      description:
        "Agree metrics and reporting frequency with the Authority per sandbox conditions.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 35",
      confidence: "best_effort",
    }),
  ];
}

export function getNoActionChecklist(): ChecklistItem[] {
  return [
    item({
      id: "nal-request",
      section: "No-action",
      label: "Draft no-action letter request",
      description:
        "Describe the proposed activity, legal uncertainty, and limited scope for which comfort is sought under Section 35(3).",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 35(3)",
      confidence: "statutory",
    }),
    item({
      id: "nal-limits",
      section: "No-action",
      label: "Define strict activity and time limits",
      description:
        "Specify what will and will not be done; no-action comfort is typically narrow and conditional.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 35(3)",
      confidence: "best_effort",
    }),
    item({
      id: "nal-counsel",
      section: "No-action",
      label: "Engage qualified counsel",
      description:
        "No-action requests are fact-specific legal instruments — obtain Pakistani counsel before filing.",
      required: true,
      sourceInstrument: "best_effort",
      sourceSection: "Implementation guidance",
      confidence: "best_effort",
    }),
  ];
}

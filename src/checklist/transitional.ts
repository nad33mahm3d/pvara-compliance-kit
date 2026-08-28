/**
 * Section 70 transitional deadline helper.
 * Does not invent portal cutoffs — pass them explicitly. See DISCLAIMER.md.
 */

import { CITATION_AS_OF, LEGAL_DISCLAIMER } from "../types.js";

export interface TransitionalDeadlineInfo {
  disclaimer: string;
  actSection: string;
  summary: string;
  sixMonthWindowNote: string;
  asOfDate: string;
  portalCutoffDate?: string;
  portalCutoffNote?: string;
}

/**
 * Thin helper documenting Section 70 transitional logic.
 * Pass portal-published cutoff dates explicitly; this function does not invent them.
 */
export function getTransitionalDeadlineInfo(options?: {
  asOfDate?: string;
  /** If PVARA/portal publishes a specific NOC cutoff for incumbents, pass it here. */
  portalCutoffDate?: string;
}): TransitionalDeadlineInfo {
  const asOfDate = options?.asOfDate ?? CITATION_AS_OF;
  return {
    disclaimer: LEGAL_DISCLAIMER,
    actSection: "Section 70",
    asOfDate,
    summary:
      "Persons providing Virtual Asset Services immediately before commencement of the Act must apply for a licence within six months of commencement or cease providing such services. After a complete application is submitted within that window, continued provision of existing services may be permitted subject to interim directives and core AML/CFT/CPF obligations.",
    sixMonthWindowNote:
      "Compute concrete calendar deadlines from the Act's commencement date and any interim directives issued by PVARA. This toolkit does not hardcode a commencement date as permanent law.",
    portalCutoffDate: options?.portalCutoffDate,
    portalCutoffNote: options?.portalCutoffDate
      ? `Caller-supplied portal/guidance cutoff: ${options.portalCutoffDate}. Verify against current official PVARA publications before relying on it.`
      : "No portal cutoff supplied. If you have a published incumbent NOC deadline from PVARA, pass portalCutoffDate explicitly.",
  };
}

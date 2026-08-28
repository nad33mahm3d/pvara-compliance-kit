/**
 * Token issuance structuring module (FRT / ART / whitepaper).
 * Not an issuance approval engine. See DISCLAIMER.md.
 */

import { z } from "zod";
import {
  CITATION_AS_OF,
  LEGAL_DISCLAIMER,
  type ChecklistItem,
  type ChecklistItemStatus,
} from "../types.js";

export { LEGAL_DISCLAIMER };

export type TokenIssuanceKind = "frt" | "art" | "other_va" | "algorithmic_prohibited_check";

export const whitepaperOutlineSchema = z.object({
  tokenName: z.string().min(1),
  issuerLegalName: z.string().min(1),
  issuanceKind: z.enum(["frt", "art", "other_va"]),
  summaryOfRights: z.string().min(1),
  technologyOverview: z.string().min(1),
  riskDisclosures: z.string().min(1),
  reserveOrBackingDescription: z.string().optional(),
  redemptionMechanism: z.string().optional(),
  governance: z.string().optional(),
  marketingRestrictionsAcknowledged: z.boolean().default(false),
});

export type WhitepaperOutline = z.infer<typeof whitepaperOutlineSchema>;

function item(
  partial: Omit<ChecklistItem, "status" | "asOfDate"> & {
    status?: ChecklistItemStatus;
  },
): ChecklistItem {
  return { status: "not_started", asOfDate: CITATION_AS_OF, ...partial };
}

/** Shared issuance / whitepaper items (Sections 30, 42–43). */
export function getIssuanceChecklist(): ChecklistItem[] {
  return [
    item({
      id: "iss-entity",
      section: "Eligibility",
      label: "Pakistan-registered issuer entity",
      description:
        "Confirm the issuer is a legal entity registered in Pakistan meeting prescribed IVAO/issuance criteria.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 30",
      confidence: "statutory",
    }),
    item({
      id: "iss-whitepaper",
      section: "Disclosures",
      label: "Publish prescribed whitepaper",
      description:
        "Publish a whitepaper in the form and manner prescribed by Regulations before offering a VA to the public.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 42",
      confidence: "statutory",
    }),
    item({
      id: "iss-ongoing",
      section: "Disclosures",
      label: "Ongoing material disclosures / reserve attestations",
      description:
        "Plan ongoing disclosures of material information including reserve attestations at prescribed frequency.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 42",
      confidence: "statutory",
    }),
    item({
      id: "iss-marketing",
      section: "Marketing",
      label: "Marketing only with valid licence/registration + risk disclosures",
      description:
        "Do not advertise or market a VA unless the issuer holds a valid licence/registration; include prescribed risk disclosures.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 43",
      confidence: "statutory",
    }),
    item({
      id: "iss-algo-ban",
      section: "Prohibitions",
      label: "Confirm not an algorithmic uncollateralised token (unless permitted)",
      description:
        "Section 53 prohibits issuing/offering/marketing VAs whose primary value-maintenance is algorithmic and not adequately collateralised, unless specifically permitted by Regulations.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 53",
      confidence: "statutory",
    }),
  ];
}

/** Fiat-Referenced Token (stablecoin) requirements — Section 31. */
export function getFrtChecklist(): ChecklistItem[] {
  return [
    ...getIssuanceChecklist(),
    item({
      id: "frt-reserves",
      section: "FRT (Section 31)",
      label: "100% reserve backing with HQLA (or prescribed assets)",
      description:
        "Maintain hundred percent reserve backing with High-Quality Liquid Assets or other assets as prescribed, held as a segregated reserve.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 31(1)(a)",
      confidence: "statutory",
    }),
    item({
      id: "frt-redemption",
      section: "FRT (Section 31)",
      label: "Par redemption without undue delay",
      description:
        "Mechanisms for redemption at par value without undue delay.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 31(1)(b)",
      confidence: "statutory",
    }),
    item({
      id: "frt-audited",
      section: "FRT (Section 31)",
      label: "Audited reserve disclosures",
      description: "Audited reserve disclosures as prescribed by the Authority.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 31(1)(c)",
      confidence: "statutory",
    }),
    item({
      id: "frt-aml",
      section: "FRT (Section 31)",
      label: "Robust AML/CFT/CPF and sanctions programmes",
      description:
        "AML, CFT, CPF and sanctions compliance programmes suitable for the FRT issuer.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 31(1)(d)",
      confidence: "statutory",
    }),
    item({
      id: "frt-insolvency",
      section: "FRT (Section 31)",
      label: "Prioritised holder protections in insolvency",
      description: "Prioritised holder protections in insolvency as required.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 31(1)(e)",
      confidence: "statutory",
    }),
  ];
}

/** Asset-Referenced Token requirements — Section 32. */
export function getArtChecklist(): ChecklistItem[] {
  return [
    ...getIssuanceChecklist(),
    item({
      id: "art-backing",
      section: "ART (Section 32)",
      label: "Fully backed by eligible underlying assets",
      description:
        "ART must be fully backed by underlying assets at all times; may reference tangible/intangible assets but must not be backed by or derive value from other Virtual Assets.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 32",
      confidence: "statutory",
    }),
    item({
      id: "art-custody",
      section: "ART (Section 32)",
      label: "Reserve custody per Regulations",
      description:
        "Hold reserves in custody in accordance with Regulations; provide audited disclosures and insolvency protections.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 32",
      confidence: "statutory",
    }),
    item({
      id: "art-no-va-backing",
      section: "ART (Section 32)",
      label: "Confirm reserves are not other Virtual Assets",
      description:
        "Underlying assets must not be other Virtual Assets per Section 32 constraints.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 32(2)",
      confidence: "statutory",
    }),
  ];
}

export function createWhitepaperOutline(
  partial: z.input<typeof whitepaperOutlineSchema>,
): WhitepaperOutline {
  return whitepaperOutlineSchema.parse(partial);
}

export function getIssuanceChecklistForKind(
  kind: TokenIssuanceKind,
): ChecklistItem[] {
  if (kind === "frt") return getFrtChecklist();
  if (kind === "art") return getArtChecklist();
  if (kind === "algorithmic_prohibited_check") {
    return getIssuanceChecklist().filter((i) => i.id === "iss-algo-ban");
  }
  return getIssuanceChecklist();
}

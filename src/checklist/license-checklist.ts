/**
 * Post-incorporation licence application checklist (Section 19(4)).
 * Not legal advice. See DISCLAIMER.md.
 */

import {
  CITATION_AS_OF,
  type ChecklistItem,
  type ChecklistItemStatus,
  type LicenseCategoryId,
} from "../types.js";

function item(
  partial: Omit<ChecklistItem, "status" | "asOfDate"> & {
    asOfDate?: string;
    status?: ChecklistItemStatus;
  },
): ChecklistItem {
  return {
    status: "not_started",
    asOfDate: CITATION_AS_OF,
    ...partial,
  };
}

/**
 * Post-incorporation full licence application checklist (Section 19(4)),
 * with light category-specific emphasis where justified.
 */
export function getLicenseChecklist(category: LicenseCategoryId): ChecklistItem[] {
  const base: ChecklistItem[] = [
    item({
      id: "lic-application-form",
      section: "Application",
      label: "Prescribed licence application form",
      description:
        "Submit the full licence application in the form and manner prescribed by PVARA after incorporation.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 19(4)",
      confidence: "statutory",
    }),
    item({
      id: "lic-fee",
      section: "Application",
      label: "Non-refundable application fee",
      description:
        "Pay the non-refundable licence application fee as prescribed. Verify the current fee schedule with PVARA — amounts are not hardcoded in this toolkit.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 19(4)",
      confidence: "statutory",
    }),
    item({
      id: "lic-corporate-docs",
      section: "Corporate",
      label: "Corporate documents",
      description:
        "Certificate of incorporation, constitutional documents, and evidence of Pakistan incorporation as required for licensees.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 19(4)",
      confidence: "statutory",
    }),
    item({
      id: "lic-business-plan",
      section: "Business",
      label: "Business plan",
      description:
        "Detailed business plan covering intended Virtual Asset Services, markets, and operational model.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 19(4)",
      confidence: "statutory",
    }),
    item({
      id: "lic-ownership",
      section: "Ownership",
      label: "Ownership structure and UBO record",
      description:
        "Ownership structure, Controllers, Sponsors, and ultimate beneficial owners with supporting disclosures.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 19(4) / Section 20",
      confidence: "statutory",
    }),
    item({
      id: "lic-aml-framework",
      section: "AML/CFT",
      label: "AML/CFT/CPF framework",
      description:
        "AML/CFT/CPF programme aligned with AMLA 2010 and PVARA expectations, including MLRO appointment.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 19(4) / Section 46",
      confidence: "statutory",
    }),
    item({
      id: "lic-key-personnel",
      section: "Fit & Proper",
      label: "Key personnel fit-and-proper evidence",
      description:
        "Evidence that Controllers, Sponsors, CEO, Directors and other Key Individuals meet fit-and-proper criteria; at least one Key Individual ordinarily resident in Pakistan with operational authority.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 20",
      confidence: "statutory",
    }),
    item({
      id: "lic-it-cyber",
      section: "Technology",
      label: "IT and cybersecurity documentation",
      description:
        "IT architecture, cybersecurity controls, business continuity and disaster recovery documentation.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 19(4)",
      confidence: "statutory",
    }),
    item({
      id: "lic-goaml",
      section: "AML/CFT",
      label: "Active FMU goAML registration",
      description:
        "Maintain active goAML credentials and reporting capability as a financial institution under AMLA 2010.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 46",
      confidence: "statutory",
    }),
  ];

  const extras: ChecklistItem[] = [];

  if (category === "custody" || category === "exchange") {
    extras.push(
      item({
        id: "lic-segregation-awareness",
        section: "Customer assets",
        label: "Customer asset segregation & custody controls (documentation)",
        description:
          "Document how Customer Assets will be segregated from firm assets, with no unauthorised rehypothecation (Act ss.24–27). Full PoR tooling is out of scope for this kit version — treat as mandatory operational design work.",
        required: true,
        sourceInstrument: "act",
        sourceSection: "Sections 24–27",
        confidence: "statutory",
      }),
    );
  }

  if (category === "issuance") {
    extras.push(
      item({
        id: "lic-issuance-whitepaper",
        section: "Issuance",
        label: "Whitepaper and issuance disclosures (planning)",
        description:
          "Plan for prescribed whitepaper, ongoing disclosures, and token-type rules (e.g. FRT/ART). Detailed issuance modules are deferred — verify current PVARA issuance regulations.",
        required: true,
        sourceInstrument: "act",
        sourceSection: "Sections 30–33 / 42",
        confidence: "best_effort",
      }),
    );
  }

  if (
    category === "exchange" ||
    category === "broker_dealer" ||
    category === "custody" ||
    category === "derivatives"
  ) {
    extras.push(
      item({
        id: "lic-aml-registered-transition",
        section: "Pathway",
        label: "Transition from AML-Registered Services (if applicable)",
        description:
          "If operating under NOC AML-Registered Services, evidence diligent progress toward full licence within the period required by the Authority.",
        required: true,
        sourceInstrument: "noc_regulations",
        sourceSection: "NOC Reg 18.1(f) / 19.1(e)",
        confidence: "regulation",
      }),
    );
  }

  return [...base, ...extras];
}

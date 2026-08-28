/**
 * Customer asset segregation and proof-of-reserves checklists (Act ss.24–27).
 * Structuring aid only — not an attestation engine. See DISCLAIMER.md.
 */

import {
  CITATION_AS_OF,
  LEGAL_DISCLAIMER,
  type ChecklistItem,
  type ChecklistItemStatus,
  type LicenseCategoryId,
} from "../types.js";

export { LEGAL_DISCLAIMER };

function item(
  partial: Omit<ChecklistItem, "status" | "asOfDate"> & {
    status?: ChecklistItemStatus;
  },
): ChecklistItem {
  return { status: "not_started", asOfDate: CITATION_AS_OF, ...partial };
}

/**
 * Checklist for customer asset segregation, custody controls, and proof-of-reserves
 * documentation under Act Sections 24–27.
 */
export function getSegregationChecklist(
  category?: LicenseCategoryId,
): ChecklistItem[] {
  const base: ChecklistItem[] = [
    item({
      id: "seg-accounts",
      section: "Segregation (Section 24)",
      label: "Segregated customer asset accounts",
      description:
        "Hold Customer Assets (VAs and fiat) in accounts segregated from the licensee's own assets at all times.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 24(1)",
      confidence: "statutory",
    }),
    item({
      id: "seg-insolvency",
      section: "Segregation (Section 24)",
      label: "Insolvency ring-fencing design",
      description:
        "Document that Customer Assets do not form part of the licensee's estate in insolvency and are ring-fenced accordingly.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 24(2)",
      confidence: "statutory",
    }),
    item({
      id: "seg-fiduciary",
      section: "Segregation (Section 24)",
      label: "Fiduciary duty and customer-best-interest controls",
      description:
        "Policies requiring the licensee to act honestly, fairly, and in customers' best interests regarding Customer Assets.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 24",
      confidence: "statutory",
    }),
    item({
      id: "seg-no-rehypo",
      section: "Segregation (Section 24)",
      label: "No unauthorised rehypothecation / lending / pledging",
      description:
        "Controls preventing rehypothecation, lending, pledging, or encumbering Customer Assets without the customer's explicit, informed, revocable written consent.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 24(4)",
      confidence: "statutory",
    }),
    item({
      id: "seg-custody-security",
      section: "Custody (Section 26)",
      label: "Secure custody, DR, and BCP",
      description:
        "Secure custody arrangements, disaster recovery, and business continuity for customer assets and keys.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 26",
      confidence: "statutory",
    }),
    item({
      id: "seg-por",
      section: "Proof of reserves (Section 27)",
      label: "Cryptographic proof-of-reserves process",
      description:
        "Process to furnish cryptographic proof-of-reserves reconciled against customer liabilities to PVARA at prescribed intervals. Interval cadence is set by the Authority — verify current prescription.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 27(1)",
      confidence: "statutory",
    }),
    item({
      id: "seg-annual-audit",
      section: "Proof of reserves (Section 27)",
      label: "Annual segregation audit by approved Chartered Accountants",
      description:
        "Engage an approved firm of Chartered Accountants to verify customer asset segregation annuallyually.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 27(2)",
      confidence: "statutory",
    }),
    item({
      id: "seg-reconciliations",
      section: "Operations",
      label: "Daily / periodic liability vs reserve reconciliations",
      description:
        "Operational reconciliations between customer liabilities and reserve/custody balances with exception handling.",
      required: true,
      sourceInstrument: "act",
      sourceSection: "Section 27",
      confidence: "best_effort",
    }),
  ];

  if (category === "custody" || category === "exchange" || category === undefined) {
    base.push(
      item({
        id: "seg-key-management",
        section: "Custody (Section 26)",
        label: "Key management / cold-hot wallet policy",
        description:
          "Document key ceremony, cold/hot wallet split, access controls, and incident response for private keys (especially material for custody and exchange).",
        required: true,
        sourceInstrument: "act",
        sourceSection: "Section 26",
        confidence: "best_effort",
      }),
    );
  }

  return base;
}

export interface ProofOfReservesAttestationDraft {
  disclaimer: string;
  asOfDate: string;
  licenseeName: string;
  reportingPeriodEnd: string;
  totalCustomerLiabilities: number;
  totalReserves: number;
  assetUnit: string;
  methodDescription: string;
  surplusOrDeficit: number;
  notes?: string;
}

/**
 * Build a draft PoR attestation record for internal packaging.
 * Does not cryptographically prove reserves.
 */
export function createProofOfReservesDraft(input: {
  licenseeName: string;
  reportingPeriodEnd: string;
  totalCustomerLiabilities: number;
  totalReserves: number;
  assetUnit: string;
  methodDescription: string;
  notes?: string;
  asOfDate?: string;
}): ProofOfReservesAttestationDraft {
  return {
    disclaimer: LEGAL_DISCLAIMER,
    asOfDate: input.asOfDate ?? CITATION_AS_OF,
    licenseeName: input.licenseeName,
    reportingPeriodEnd: input.reportingPeriodEnd,
    totalCustomerLiabilities: input.totalCustomerLiabilities,
    totalReserves: input.totalReserves,
    assetUnit: input.assetUnit,
    methodDescription: input.methodDescription,
    surplusOrDeficit: input.totalReserves - input.totalCustomerLiabilities,
    notes: input.notes,
  };
}

/**
 * Schedule I / Section 18 Virtual Asset Service categories.
 *
 * Structuring aid only — not a licensing determination. See DISCLAIMER.md.
 */

import type { LicenseCategoryId } from "../types.js";

export interface LicenseCategory {
  id: LicenseCategoryId;
  label: string;
  description: string;
  /** Eligible for AML-Registered Services pathway under NOC Regulations (four categories). */
  amlRegisteredEligible: boolean;
  sourceSection: string;
}

/**
 * The ten licensable Virtual Asset Service categories under Schedule I / Section 18.
 */
export const LICENSE_CATEGORIES: readonly LicenseCategory[] = [
  {
    id: "advisory",
    label: "Advisory services",
    description:
      "Personalised investment recommendations relating to virtual asset transactions. General market research and educational content typically does not qualify.",
    amlRegisteredEligible: false,
    sourceSection: "Section 18 / Schedule I",
  },
  {
    id: "broker_dealer",
    label: "Broker-dealer services",
    description:
      "Arranging or facilitating buy/sell orders, soliciting or accepting orders, proprietary trading using customer assets, market-making, or placement/distribution for issuers.",
    amlRegisteredEligible: true,
    sourceSection: "Section 18 / Schedule I",
  },
  {
    id: "custody",
    label: "Custody and administration services",
    description:
      "Safekeeping of virtual assets or private keys on behalf of customers. Self-custody where the customer retains exclusive key control is generally not caught.",
    amlRegisteredEligible: true,
    sourceSection: "Section 18 / Schedule I",
  },
  {
    id: "exchange",
    label: "Exchange services",
    description:
      "Exchanging virtual assets for fiat or other virtual assets, matching buyers and sellers, or maintaining an order book.",
    amlRegisteredEligible: true,
    sourceSection: "Section 18 / Schedule I",
  },
  {
    id: "lending_borrowing",
    label: "Lending and borrowing services",
    description:
      "Facilitation, arrangement, intermediation, or direct provision of VA lending/borrowing with a contractual obligation to return equivalent assets plus interest/fees.",
    amlRegisteredEligible: false,
    sourceSection: "Section 18 / Schedule I",
  },
  {
    id: "derivatives",
    label: "Virtual asset derivatives services",
    description:
      "Offering, executing, clearing, or arranging futures, options, swaps, CFDs, or similar where the underlying is a virtual asset.",
    amlRegisteredEligible: true,
    sourceSection: "Section 18 / Schedule I",
  },
  {
    id: "asset_management",
    label: "Management and investment services",
    description:
      "Fiduciary/agency management of another's virtual assets, including discretionary portfolio management and discretionary staking.",
    amlRegisteredEligible: false,
    sourceSection: "Section 18 / Schedule I",
  },
  {
    id: "transfer_settlement",
    label: "Transfer and settlement services",
    description:
      "Transfer, transmission, or settlement of virtual assets between parties or wallet addresses (excludes exchange execution).",
    amlRegisteredEligible: false,
    sourceSection: "Section 18 / Schedule I",
  },
  {
    id: "issuance",
    label: "Virtual asset issuance services",
    description:
      "Creation, issuance, initial offering, administration and ongoing management, including supply control, reserve management, redemption, governance and disclosures.",
    amlRegisteredEligible: false,
    sourceSection: "Section 18 / Schedule I",
  },
  {
    id: "mining_related",
    label: "Mining-related services",
    description:
      "Mining that provides services to third parties involving customer assets or funds. Pure mining for own account does not require a licence.",
    amlRegisteredEligible: false,
    sourceSection: "Section 18 / Schedule I",
  },
] as const;

export const LICENSE_CATEGORY_BY_ID: ReadonlyMap<
  LicenseCategoryId,
  LicenseCategory
> = new Map(LICENSE_CATEGORIES.map((c) => [c.id, c]));

/** Categories that may be provided as AML-Registered Services after NOC + goAML registration (NOC Regs). */
export const AML_REGISTERED_CATEGORY_IDS: readonly LicenseCategoryId[] = [
  "broker_dealer",
  "custody",
  "exchange",
  "derivatives",
];

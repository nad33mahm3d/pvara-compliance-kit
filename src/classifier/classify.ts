/**
 * Deterministic rules-engine classifier: BusinessProfile -> likely Schedule I categories.
 *
 * Not a licensing determination or legal advice. See DISCLAIMER.md / LEGAL_DISCLAIMER.
 */

import { LEGAL_DISCLAIMER, type LicenseCategoryId } from "../types.js";
import {
  AML_REGISTERED_CATEGORY_IDS,
  LICENSE_CATEGORY_BY_ID,
  type LicenseCategory,
} from "./categories.js";

export { LEGAL_DISCLAIMER };

export type YesNo = "yes" | "no";

/**
 * Structured answers about what the business does.
 * Free-text / LLM classification is intentionally unsupported.
 */
export interface BusinessProfile {
  /** Safekeeps customer VAs or private keys (customer does not retain exclusive control). */
  holdsCustomerKeysOrAssets?: YesNo;
  /** Customer retains exclusive control of keys (self-custody wallet software only). */
  selfCustodyOnly?: YesNo;
  /** Operates an exchange / order book / VA↔fiat or VA↔VA matching. */
  operatesExchangeOrOrderBook?: YesNo;
  /** Arranges or facilitates customer buy/sell orders, market-making, or placement. */
  arrangesOrFacilitatesOrders?: YesNo;
  /** Trades solely on own account without customer orders or control of customer assets. */
  proprietaryTradingOnly?: YesNo;
  /** Gives personalised VA investment recommendations to clients. */
  providesPersonalisedAdvice?: YesNo;
  /** Publishes only general education / market research (not personalised advice). */
  generalEducationOnly?: YesNo;
  /** Facilitates or provides VA lending/borrowing with return of equivalent + interest/fees. */
  facilitatesLendingOrBorrowing?: YesNo;
  /** Offers VA derivatives (futures, options, swaps, CFDs, etc.). */
  offersDerivatives?: YesNo;
  /** Discretionary management / staking of customer VAs. */
  managesCustomerPortfolios?: YesNo;
  /** Transfers or settles VAs between parties/wallets outside exchange execution. */
  providesTransferOrSettlement?: YesNo;
  /** Issues, offers, or administers a virtual asset (including reserves/redemption). */
  issuesOrAdministersToken?: YesNo;
  /** Provides mining services involving third-party / customer assets or funds. */
  miningServicesForThirdParties?: YesNo;
  /** Mines only for own account. */
  pureOwnAccountMining?: YesNo;
}

export interface ClassificationResult {
  category: LicenseCategory;
  rank: number;
  score: number;
  amlRegisteredEligible: boolean;
  reasoningTrail: string[];
}

export interface ClassificationOutput {
  results: ClassificationResult[];
  exemptionsApplied: string[];
  disclaimer: string;
}

function isYes(v: YesNo | undefined): boolean {
  return v === "yes";
}

/**
 * Classify a structured business profile into ranked likely licence categories.
 * Deterministic rules only — auditable, no LLM.
 */
export function classify(profile: BusinessProfile): ClassificationOutput {
  const exemptionsApplied: string[] = [];
  const hits = new Map<
    LicenseCategoryId,
    { score: number; reasons: string[] }
  >();

  const add = (id: LicenseCategoryId, score: number, reason: string) => {
    const existing = hits.get(id) ?? { score: 0, reasons: [] };
    existing.score += score;
    existing.reasons.push(reason);
    hits.set(id, existing);
  };

  // --- Exemptions (negative paths) ---
  if (isYes(profile.selfCustodyOnly) && !isYes(profile.holdsCustomerKeysOrAssets)) {
    exemptionsApplied.push(
      "Self-custody only (customer retains exclusive key control) — custody licensing typically not triggered.",
    );
  }

  if (
    isYes(profile.proprietaryTradingOnly) &&
    !isYes(profile.arrangesOrFacilitatesOrders) &&
    !isYes(profile.holdsCustomerKeysOrAssets)
  ) {
    exemptionsApplied.push(
      "Proprietary trading solely on own account without customer orders or customer assets — broker-dealer typically not triggered.",
    );
  }

  if (isYes(profile.pureOwnAccountMining) && !isYes(profile.miningServicesForThirdParties)) {
    exemptionsApplied.push(
      "Pure mining for own account — mining-related services licence typically not required.",
    );
  }

  if (isYes(profile.generalEducationOnly) && !isYes(profile.providesPersonalisedAdvice)) {
    exemptionsApplied.push(
      "General education / market research only — advisory services typically not triggered.",
    );
  }

  // --- Positive rules ---
  if (isYes(profile.holdsCustomerKeysOrAssets) && !isYes(profile.selfCustodyOnly)) {
    add(
      "custody",
      10,
      "Holds customer virtual assets or private keys (not exclusive customer self-custody).",
    );
  }

  if (isYes(profile.operatesExchangeOrOrderBook)) {
    add(
      "exchange",
      10,
      "Operates exchange, order book, or VA↔fiat / VA↔VA matching.",
    );
  }

  if (
    isYes(profile.arrangesOrFacilitatesOrders) &&
    !isYes(profile.proprietaryTradingOnly)
  ) {
    add(
      "broker_dealer",
      10,
      "Arranges or facilitates customer orders / market-making / placement.",
    );
  } else if (
    isYes(profile.arrangesOrFacilitatesOrders) &&
    isYes(profile.holdsCustomerKeysOrAssets)
  ) {
    add(
      "broker_dealer",
      8,
      "Facilitates orders while controlling customer assets (proprietary-only exemption does not apply).",
    );
  }

  if (isYes(profile.providesPersonalisedAdvice) && !isYes(profile.generalEducationOnly)) {
    add(
      "advisory",
      10,
      "Provides personalised virtual-asset investment recommendations.",
    );
  }

  if (isYes(profile.facilitatesLendingOrBorrowing)) {
    add(
      "lending_borrowing",
      10,
      "Facilitates or provides VA lending/borrowing with contractual return + fees/interest.",
    );
  }

  if (isYes(profile.offersDerivatives)) {
    add("derivatives", 10, "Offers virtual-asset derivatives products or clearing/arrangement.");
  }

  if (isYes(profile.managesCustomerPortfolios)) {
    add(
      "asset_management",
      10,
      "Provides discretionary management or staking of customer virtual assets.",
    );
  }

  if (isYes(profile.providesTransferOrSettlement)) {
    add(
      "transfer_settlement",
      10,
      "Provides transfer, transmission, or settlement of VAs outside exchange execution.",
    );
  }

  if (isYes(profile.issuesOrAdministersToken)) {
    add(
      "issuance",
      10,
      "Issues, offers, or administers a virtual asset (including reserves/redemption/governance).",
    );
  }

  if (isYes(profile.miningServicesForThirdParties)) {
    add(
      "mining_related",
      10,
      "Mining-related services involving third-party or customer assets/funds.",
    );
  }

  const results: ClassificationResult[] = [...hits.entries()]
    .map(([id, { score, reasons }]) => {
      const category = LICENSE_CATEGORY_BY_ID.get(id);
      if (!category) {
        throw new Error(`Unknown category id: ${id}`);
      }
      return {
        category,
        score,
        amlRegisteredEligible: AML_REGISTERED_CATEGORY_IDS.includes(id),
        reasoningTrail: reasons,
        rank: 0,
      };
    })
    .sort((a, b) => b.score - a.score || a.category.id.localeCompare(b.category.id))
    .map((r, index) => ({ ...r, rank: index + 1 }));

  return {
    results,
    exemptionsApplied,
    disclaimer: LEGAL_DISCLAIMER,
  };
}

/**
 * Classifier module — deterministic Schedule I category rules engine.
 * Not legal advice. See DISCLAIMER.md.
 */

export {
  LICENSE_CATEGORIES,
  LICENSE_CATEGORY_BY_ID,
  AML_REGISTERED_CATEGORY_IDS,
  type LicenseCategory,
} from "./categories.js";

export {
  classify,
  LEGAL_DISCLAIMER,
  type BusinessProfile,
  type ClassificationResult,
  type ClassificationOutput,
  type YesNo,
} from "./classify.js";

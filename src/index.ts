/**
 * pvara-compliance-kit
 *
 * Structuring toolkit for Pakistan VASP compliance work under the Virtual Assets Act, 2026.
 * Not legal advice. Not affiliated with or endorsed by PVARA. See DISCLAIMER.md.
 */

export {
  LEGAL_DISCLAIMER,
  CITATION_AS_OF,
  citation,
  type SourceInstrument,
  type CitationConfidence,
  type Citation,
  type ChecklistItem,
  type ChecklistItemStatus,
  type LicenseCategoryId,
} from "./types.js";

export {
  LICENSE_CATEGORIES,
  LICENSE_CATEGORY_BY_ID,
  AML_REGISTERED_CATEGORY_IDS,
  classify,
  type LicenseCategory,
  type BusinessProfile,
  type ClassificationResult,
  type ClassificationOutput,
  type YesNo,
} from "./classifier/index.js";

export {
  getNocChecklist,
  getLicenseChecklist,
  exportChecklist,
  getTransitionalDeadlineInfo,
  setChecklistItemStatus,
  type ChecklistState,
  type TransitionalDeadlineInfo,
} from "./checklist/index.js";

export {
  travelRulePayloadSchema,
  validateTravelRulePayload,
  parseTravelRulePayload,
  type TravelRulePayload,
  type TravelRuleValidationResult,
} from "./travel-rule/index.js";

export {
  individualKycSchema,
  entityKycSchema,
  kycRecordSchema,
  validateCnic,
  type IndividualKyc,
  type EntityKyc,
  type KycRecord,
  type CnicValidationResult,
} from "./kyc/index.js";

export {
  GOAML_MODULE_WARNING,
  strReportSchema,
  ctrReportSchema,
  isarReportSchema,
  formatStrReport,
  formatCtrReport,
  formatIsarReport,
  type StrReport,
  type CtrReport,
  type IsarReport,
  type FormatResult,
} from "./goaml/index.js";

export {
  KEY_INDIVIDUAL_ROLES,
  FIT_PROPER_QUESTIONS,
  fitProperQuestionnaireSchema,
  createFitProperQuestionnaire,
  assessFitProperCompleteness,
  exportFitProperMarkdown,
  type KeyIndividualRole,
  type FitProperQuestionnaire,
  type FitProperQuestion,
  type FitProperCompletenessResult,
} from "./fit-proper/index.js";

export {
  TFS_MODULE_WARNING,
  StubTfsScreeningAdapter,
  getTfsScreeningChecklist,
  createScreeningRequest,
  screeningRequestSchema,
  screeningResultSchema,
  type ScreeningSubject,
  type ScreeningRequest,
  type ScreeningResult,
  type TfsScreeningAdapter,
} from "./tfs/index.js";

export {
  getSegregationChecklist,
  createProofOfReservesDraft,
  type ProofOfReservesAttestationDraft,
} from "./segregation/index.js";

export {
  recommendPathway,
  getSandboxChecklist,
  getNoActionChecklist,
  type PathwayKind,
  type PathwayAssessmentInput,
  type PathwayRecommendation,
} from "./sandbox/index.js";

export {
  getIssuanceChecklist,
  getFrtChecklist,
  getArtChecklist,
  getIssuanceChecklistForKind,
  createWhitepaperOutline,
  whitepaperOutlineSchema,
  type TokenIssuanceKind,
  type WhitepaperOutline,
} from "./issuance/index.js";

export {
  CAPITAL_FEE_MODULE_WARNING,
  createEmptyCapitalFeeMatrix,
  parseCapitalFeeMatrix,
  getCapitalRequirement,
  listFees,
  isCapitalMatrixComplete,
  type CapitalFeeMatrix,
  type FeeScheduleEntry,
  type CategoryCapitalRequirement,
  type MoneyAmount,
} from "./capital/index.js";

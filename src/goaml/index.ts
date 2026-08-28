/**
 * goAML module — best-effort STR/CTR/ISAR structures. Least certain module.
 * Does not submit filings. See DISCLAIMER.md.
 */

export {
  GOAML_MODULE_WARNING,
  strReportSchema,
  ctrReportSchema,
  isarReportSchema,
  goamlReportSchema,
  type StrReport,
  type CtrReport,
  type IsarReport,
  type GoamlReport,
} from "./report-schema.js";

export {
  formatStrReport,
  formatCtrReport,
  formatIsarReport,
  LEGAL_DISCLAIMER,
  type FormatResult,
} from "./format.js";

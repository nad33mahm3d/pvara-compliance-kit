/**
 * Helpers to shape internal data into goAML-oriented report structures.
 * Best-effort only — does not submit to FMU. See DISCLAIMER.md.
 */

import { LEGAL_DISCLAIMER } from "../types.js";
import {
  GOAML_MODULE_WARNING,
  ctrReportSchema,
  isarReportSchema,
  strReportSchema,
  type CtrReport,
  type IsarReport,
  type StrReport,
} from "./report-schema.js";

export { GOAML_MODULE_WARNING, LEGAL_DISCLAIMER };

export interface FormatResult<T> {
  ok: boolean;
  data?: T;
  errors: string[];
  warning: string;
  disclaimer: string;
}

function toResult<T>(
  parsed: { success: true; data: T } | { success: false; error: { issues: { path: (string | number)[]; message: string }[] } },
): FormatResult<T> {
  if (parsed.success) {
    return {
      ok: true,
      data: parsed.data,
      errors: [],
      warning: GOAML_MODULE_WARNING,
      disclaimer: LEGAL_DISCLAIMER,
    };
  }
  return {
    ok: false,
    errors: parsed.error.issues.map(
      (i) => `${i.path.join(".") || "report"}: ${i.message}`,
    ),
    warning: GOAML_MODULE_WARNING,
    disclaimer: LEGAL_DISCLAIMER,
  };
}

/** Shape internal data into an STR-oriented structure (not FMU XML). */
export function formatStrReport(input: unknown): FormatResult<StrReport> {
  return toResult(strReportSchema.safeParse(input));
}

/** Shape internal data into a CTR-oriented structure (not FMU XML). */
export function formatCtrReport(input: unknown): FormatResult<CtrReport> {
  return toResult(ctrReportSchema.safeParse(input));
}

/** Shape internal escalation data into an ISAR-oriented structure (Form A7-aligned). */
export function formatIsarReport(input: unknown): FormatResult<IsarReport> {
  return toResult(isarReportSchema.safeParse(input));
}

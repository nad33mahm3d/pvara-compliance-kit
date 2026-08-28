/**
 * Form A3 Fit & Proper questionnaire builder (NOC Reg 6.4).
 * Structures answers for Key Individuals — does not determine fitness. See DISCLAIMER.md.
 */

import { z } from "zod";
import { CITATION_AS_OF, LEGAL_DISCLAIMER } from "../types.js";

export { LEGAL_DISCLAIMER };

export const KEY_INDIVIDUAL_ROLES = [
  "ceo",
  "director",
  "cfo",
  "compliance_officer",
  "mlro",
  "head_of_internal_audit",
  "head_of_risk_management",
  "head_of_information_security",
  "other_senior_management",
] as const;

export type KeyIndividualRole = (typeof KEY_INDIVIDUAL_ROLES)[number];

export const yesNoSchema = z.enum(["yes", "no"]);

export const employmentHistoryEntrySchema = z.object({
  employerName: z.string().min(1),
  country: z.string().min(1),
  positionHeld: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  keyResponsibilities: z.string().min(1),
  amlCftResponsibilities: z.string().optional(),
  reasonForLeaving: z.string().optional(),
});

export const qualificationSchema = z.object({
  title: z.string().min(1),
  institution: z.string().min(1),
  year: z.string().optional(),
});

export const professionalReferenceSchema = z.object({
  name: z.string().min(1),
  organisation: z.string().min(1),
  relationship: z.string().min(1),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
});

/**
 * Interactive Form A3 answer model aligned to NOC Reg Form A3 sections.
 */
export const fitProperQuestionnaireSchema = z.object({
  formId: z.literal("A3"),
  sourceSection: z.literal("NOC Reg 6.4 / Form A3"),
  asOfDate: z.string(),
  role: z.enum(KEY_INDIVIDUAL_ROLES),
  roleOtherDescription: z.string().optional(),

  // Section 1 — Personal information (empty allowed on draft; completeness check enforces)
  fullName: z.string(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  nationality: z.string().length(2).optional(),
  cnic: z.string().optional(),
  passportNumber: z.string().optional(),
  residentialAddress: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),

  // Section 2 — Employment history (last 10 years)
  employmentHistory: z.array(employmentHistoryEntrySchema).default([]),
  employmentGapsExplanation: z.string().optional(),

  // Section 3 — Qualifications
  academicQualifications: z.array(qualificationSchema).default([]),
  professionalQualifications: z.array(qualificationSchema).default([]),
  amlTraining: z.string().optional(),

  // Section 4 — Regulatory & supervisory record
  beenWarnedOrReprimanded: yesNoSchema.optional(),
  beenRefusedLicence: yesNoSchema.optional(),
  beenDisqualifiedAsDirector: yesNoSchema.optional(),
  regulatoryRecordDetails: z.string().optional(),

  // Section 5 — Criminal record & investigations
  criminalConviction: yesNoSchema.optional(),
  underInvestigation: yesNoSchema.optional(),
  criminalRecordDetails: z.string().optional(),

  // Section 6 — Financial soundness
  declaredBankrupt: yesNoSchema.optional(),
  insolvencyOrRestructuring: yesNoSchema.optional(),
  financialSoundnessDetails: z.string().optional(),

  // Section 7 — Conflicts of interest
  conflictsWithShareholdersOrManagement: yesNoSchema.optional(),
  financialInterestsInServiceProviders: yesNoSchema.optional(),
  outsideDirectorshipsOrEmployment: yesNoSchema.optional(),
  otherConflicts: yesNoSchema.optional(),
  conflictMitigationNarrative: z.string().optional(),

  // Section 8 — Integrity & ethics
  integrityConcerns: yesNoSchema.optional(),
  integrityDetails: z.string().optional(),

  // Section 9 — Health / capacity
  medicallyFit: yesNoSchema.optional(),
  impairingCondition: yesNoSchema.optional(),
  healthMitigation: z.string().optional(),

  // Section 10 — References
  professionalReferences: z.array(professionalReferenceSchema).default([]),

  // Section 11 — Other roles / time commitments
  otherRolesAndTimeCommitments: z.string().optional(),

  // Section 12 — Declaration
  declarationAccepted: z.boolean().default(false),
  declarationDate: z.string().optional(),
  signatureName: z.string().optional(),
});

export type FitProperQuestionnaire = z.infer<typeof fitProperQuestionnaireSchema>;

export interface FitProperQuestion {
  id: string;
  section: string;
  field: keyof FitProperQuestionnaire;
  prompt: string;
  required: boolean;
  inputType: "text" | "yes_no" | "date" | "boolean" | "list";
}

/** Ordered Form A3 prompts for interactive UIs. */
export const FIT_PROPER_QUESTIONS: readonly FitProperQuestion[] = [
  {
    id: "a3-role",
    section: "Role",
    field: "role",
    prompt: "Key Individual role",
    required: true,
    inputType: "text",
  },
  {
    id: "a3-name",
    section: "Section 1 — Personal information",
    field: "fullName",
    prompt: "Full legal name",
    required: true,
    inputType: "text",
  },
  {
    id: "a3-dob",
    section: "Section 1 — Personal information",
    field: "dateOfBirth",
    prompt: "Date of birth (YYYY-MM-DD)",
    required: true,
    inputType: "date",
  },
  {
    id: "a3-nationality",
    section: "Section 1 — Personal information",
    field: "nationality",
    prompt: "Nationality (ISO 3166-1 alpha-2)",
    required: true,
    inputType: "text",
  },
  {
    id: "a3-cnic",
    section: "Section 1 — Personal information",
    field: "cnic",
    prompt: "CNIC (if Pakistani national) or passport number",
    required: false,
    inputType: "text",
  },
  {
    id: "a3-address",
    section: "Section 1 — Personal information",
    field: "residentialAddress",
    prompt: "Residential address (attach proof)",
    required: true,
    inputType: "text",
  },
  {
    id: "a3-employment",
    section: "Section 2 — Employment history",
    field: "employmentHistory",
    prompt: "Employment history for the last 10 years",
    required: true,
    inputType: "list",
  },
  {
    id: "a3-gaps",
    section: "Section 2 — Employment history",
    field: "employmentGapsExplanation",
    prompt: "Explain employment gaps of three months or more",
    required: false,
    inputType: "text",
  },
  {
    id: "a3-academic",
    section: "Section 3 — Qualifications",
    field: "academicQualifications",
    prompt: "Academic qualifications",
    required: true,
    inputType: "list",
  },
  {
    id: "a3-warned",
    section: "Section 4 — Regulatory record",
    field: "beenWarnedOrReprimanded",
    prompt: "Have you ever been issued a warning, reprimand, or supervisory restriction?",
    required: true,
    inputType: "yes_no",
  },
  {
    id: "a3-refused",
    section: "Section 4 — Regulatory record",
    field: "beenRefusedLicence",
    prompt: "Have you ever been refused a licence, authorisation, or registration?",
    required: true,
    inputType: "yes_no",
  },
  {
    id: "a3-criminal",
    section: "Section 5 — Criminal record",
    field: "criminalConviction",
    prompt: "Have you ever been convicted of a criminal offence?",
    required: true,
    inputType: "yes_no",
  },
  {
    id: "a3-investigation",
    section: "Section 5 — Criminal record",
    field: "underInvestigation",
    prompt: "Are you currently under investigation by any authority?",
    required: true,
    inputType: "yes_no",
  },
  {
    id: "a3-bankrupt",
    section: "Section 6 — Financial soundness",
    field: "declaredBankrupt",
    prompt: "Have you ever been declared bankrupt or insolvent?",
    required: true,
    inputType: "yes_no",
  },
  {
    id: "a3-conflicts",
    section: "Section 7 — Conflicts",
    field: "conflictsWithShareholdersOrManagement",
    prompt: "Any relationships with shareholders, Controllers, UBOs, or senior management?",
    required: true,
    inputType: "yes_no",
  },
  {
    id: "a3-conflict-narrative",
    section: "Section 7 — Conflicts",
    field: "conflictMitigationNarrative",
    prompt: "Describe conflict mitigation (if any conflicts identified)",
    required: false,
    inputType: "text",
  },
  {
    id: "a3-fit",
    section: "Section 9 — Health & capacity",
    field: "medicallyFit",
    prompt: "Are you medically and mentally fit to perform the Key Individual role?",
    required: true,
    inputType: "yes_no",
  },
  {
    id: "a3-refs",
    section: "Section 10 — References",
    field: "professionalReferences",
    prompt: "Professional references",
    required: true,
    inputType: "list",
  },
  {
    id: "a3-other-roles",
    section: "Section 11 — Time commitments",
    field: "otherRolesAndTimeCommitments",
    prompt: "Other roles and time commitments",
    required: false,
    inputType: "text",
  },
  {
    id: "a3-declaration",
    section: "Section 12 — Declaration",
    field: "declarationAccepted",
    prompt: "I declare that all information provided is true, complete, and accurate",
    required: true,
    inputType: "boolean",
  },
];

/**
 * Create an empty Form A3 questionnaire for a Key Individual role.
 */
export function createFitProperQuestionnaire(
  role: KeyIndividualRole,
  partial?: Partial<FitProperQuestionnaire>,
): FitProperQuestionnaire {
  return fitProperQuestionnaireSchema.parse({
    formId: "A3",
    sourceSection: "NOC Reg 6.4 / Form A3",
    asOfDate: CITATION_AS_OF,
    role,
    fullName: partial?.fullName ?? "",
    employmentHistory: [],
    academicQualifications: [],
    professionalQualifications: [],
    professionalReferences: [],
    declarationAccepted: false,
    ...partial,
  });
}

export interface FitProperCompletenessResult {
  complete: boolean;
  missingFields: string[];
  blockingYesAnswers: string[];
  disclaimer: string;
  note: string;
}

/**
 * Check structural completeness for Form A3. Does not decide fit-and-proper outcome.
 * "Yes" answers on adverse questions are flagged for narrative follow-up, not auto-fail.
 */
export function assessFitProperCompleteness(
  questionnaire: FitProperQuestionnaire,
): FitProperCompletenessResult {
  const missingFields: string[] = [];
  const requiredScalars: (keyof FitProperQuestionnaire)[] = [
    "fullName",
    "dateOfBirth",
    "nationality",
    "residentialAddress",
    "beenWarnedOrReprimanded",
    "beenRefusedLicence",
    "criminalConviction",
    "underInvestigation",
    "declaredBankrupt",
    "conflictsWithShareholdersOrManagement",
    "medicallyFit",
  ];

  for (const field of requiredScalars) {
    const value = questionnaire[field];
    if (value === undefined || value === null || value === "") {
      missingFields.push(String(field));
    }
  }

  if (!questionnaire.employmentHistory.length) {
    missingFields.push("employmentHistory");
  }
  if (!questionnaire.academicQualifications.length) {
    missingFields.push("academicQualifications");
  }
  if (!questionnaire.professionalReferences.length) {
    missingFields.push("professionalReferences");
  }
  if (!questionnaire.declarationAccepted) {
    missingFields.push("declarationAccepted");
  }

  const adverseFlags: { field: keyof FitProperQuestionnaire; label: string }[] = [
    { field: "beenWarnedOrReprimanded", label: "regulatory warning/reprimand" },
    { field: "beenRefusedLicence", label: "licence refusal" },
    { field: "criminalConviction", label: "criminal conviction" },
    { field: "underInvestigation", label: "under investigation" },
    { field: "declaredBankrupt", label: "bankruptcy/insolvency" },
    { field: "conflictsWithShareholdersOrManagement", label: "conflicts of interest" },
    { field: "impairingCondition", label: "impairing health condition" },
  ];

  const blockingYesAnswers: string[] = [];
  for (const flag of adverseFlags) {
    if (questionnaire[flag.field] === "yes") {
      blockingYesAnswers.push(
        `${flag.label} — provide details / mitigation narrative and supporting documents`,
      );
    }
  }

  if (
    questionnaire.conflictsWithShareholdersOrManagement === "yes" &&
    !questionnaire.conflictMitigationNarrative
  ) {
    missingFields.push("conflictMitigationNarrative");
  }

  return {
    complete: missingFields.length === 0,
    missingFields,
    blockingYesAnswers,
    disclaimer: LEGAL_DISCLAIMER,
    note:
      "Completeness check only. PVARA (or the licensee for designated roles) determines fit-and-proper outcomes. Adverse answers require disclosure, not automatic rejection by this toolkit.",
  };
}

/**
 * Export Form A3 answers to Markdown for review packs.
 */
export function exportFitProperMarkdown(q: FitProperQuestionnaire): string {
  const lines = [
    `# Form A3 — Fit & Proper Questionnaire`,
    ``,
    `> ${LEGAL_DISCLAIMER}`,
    ``,
    `- Role: **${q.role}**`,
    `- Name: **${q.fullName || "(incomplete)"}**`,
    `- Source: ${q.sourceSection} (as of ${q.asOfDate})`,
    ``,
    `## Personal`,
    `- DOB: ${q.dateOfBirth ?? "—"}`,
    `- Nationality: ${q.nationality ?? "—"}`,
    `- CNIC: ${q.cnic ?? "—"}`,
    `- Passport: ${q.passportNumber ?? "—"}`,
    `- Address: ${q.residentialAddress ?? "—"}`,
    ``,
    `## Employment history (${q.employmentHistory.length})`,
  ];

  for (const e of q.employmentHistory) {
    lines.push(
      `- ${e.employerName} / ${e.positionHeld} (${e.startDate}–${e.endDate ?? "present"}) — ${e.country}`,
    );
  }

  lines.push(
    ``,
    `## Regulatory / integrity flags`,
    `- Warned/reprimanded: ${q.beenWarnedOrReprimanded ?? "—"}`,
    `- Licence refused: ${q.beenRefusedLicence ?? "—"}`,
    `- Criminal conviction: ${q.criminalConviction ?? "—"}`,
    `- Under investigation: ${q.underInvestigation ?? "—"}`,
    `- Bankrupt/insolvent: ${q.declaredBankrupt ?? "—"}`,
    `- Conflicts: ${q.conflictsWithShareholdersOrManagement ?? "—"}`,
    ``,
    `## Declaration`,
    `- Accepted: ${q.declarationAccepted ? "yes" : "no"}`,
    `- Signed as: ${q.signatureName ?? "—"}`,
    `- Date: ${q.declarationDate ?? "—"}`,
    ``,
  );

  return lines.join("\n");
}

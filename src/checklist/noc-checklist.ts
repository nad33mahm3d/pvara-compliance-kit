/**
 * Pre-incorporation NOC checklist (Section 19(1) + NOC Regulations Forms A1–A8).
 * Not legal advice. See DISCLAIMER.md.
 */

import {
  CITATION_AS_OF,
  type ChecklistItem,
  type ChecklistItemStatus,
  type CitationConfidence,
  type SourceInstrument,
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
 * Pre-incorporation NOC / AML registration checklist mapped from NOC Regulations
 * Forms A1–A8 and related governance/AML minimums.
 */
export function getNocChecklist(): ChecklistItem[] {
  const reg = (
    id: string,
    section: string,
    label: string,
    description: string,
    sourceSection: string,
    required = true,
    confidence: CitationConfidence = "regulation",
    sourceInstrument: SourceInstrument = "noc_regulations",
  ): ChecklistItem =>
    item({
      id,
      section,
      label,
      description,
      required,
      sourceInstrument,
      sourceSection,
      confidence,
    });

  return [
    reg(
      "noc-a1",
      "Form A1",
      "Form A1 — Application for NOC / AML Registration",
      "Complete Form A1 with applicant details, group structure, and services for which AML registration is sought.",
      "NOC Reg 15.1 / Form A1",
    ),
    reg(
      "noc-a1-fee",
      "Form A1",
      "Prescribed application fee",
      "Pay the fee prescribed by PVARA for the NOC application. Amount is set by the Authority — verify current schedule; this toolkit does not hardcode fee amounts.",
      "Section 19(2) / NOC Reg 15.1",
      true,
      "statutory",
      "act",
    ),
    reg(
      "noc-a2",
      "Ownership",
      "Form A2 — Controller & Beneficial Owner disclosure",
      "Disclose Controllers (directly or indirectly 20%+ voting power or share capital) and Beneficial Owners per AMLA definitions; attach ownership/control charts.",
      "NOC Reg 7 / Form A2",
    ),
    reg(
      "noc-a3",
      "Fit & Proper",
      "Form A3 — Fit & Proper questionnaires for all Key Individuals",
      "Submit Fit & Proper declarations for CEO, Directors, CFO, Compliance Officer, MLRO, Head of Internal Audit, Head of Risk Management, Head of Information Security (and any other designated Key Individuals).",
      "NOC Reg 5–6 / Form A3",
    ),
    reg(
      "noc-key-individuals",
      "Fit & Proper",
      "Appoint required Key Individuals",
      "Maintain Key Individuals as required: CEO, Director, CFO, Compliance Officer, MLRO (may combine with Compliance where justified), Head of Internal Audit, Head of Risk Management, Head of Information Security.",
      "NOC Reg 5.1–5.2",
    ),
    reg(
      "noc-a4",
      "AML/CFT Framework",
      "Form A4 — AML/CFT Framework Submission Statement",
      "Board-approved AML/CFT policy and Form A4 signed by CEO and MLRO covering CDD/EDD, monitoring, and reporting controls.",
      "NOC Reg 8 / Form A4",
    ),
    reg(
      "noc-aml-policy",
      "AML/CFT Framework",
      "Board-approved AML/CFT policy and procedures",
      "Documented CDD and EDD procedures, PEP management, transaction monitoring, and STR/CTR escalation procedures proportionate to the business.",
      "NOC Reg 8.2",
    ),
    reg(
      "noc-tfs",
      "AML/CFT Framework",
      "Targeted Financial Sanctions (TFS) screening procedures",
      "Controls to screen customers, beneficial owners, and relevant counterparties against applicable TFS/sanctions lists on an ongoing basis.",
      "NOC Reg 8.2 / Reg 12",
    ),
    reg(
      "noc-str-ctr",
      "goAML / Reporting",
      "STR and CTR internal escalation and external reporting procedures",
      "Demonstrate readiness to file Suspicious Transaction Reports and Currency Transaction Reports via FMU goAML once registered.",
      "NOC Reg 11",
    ),
    reg(
      "noc-goaml-readiness",
      "goAML / Reporting",
      "FMU goAML technical readiness",
      "Describe internal STR/CTR workflow and systems readiness for goAML registration as the reporting entity for AML-Registered Services.",
      "NOC Reg 11.5–11.6 / Form A1 §7",
    ),
    reg(
      "noc-a5",
      "Outsourcing",
      "Form A5 — Outsourcing declaration & register",
      "Declare outsourcing arrangements; core AML functions (CDD, EDD, TFS, monitoring, STR/CTR, MLRO) must not be improperly outsourced.",
      "NOC Reg / Form A5",
    ),
    reg(
      "noc-a6-awareness",
      "Ongoing",
      "Awareness of Form A6 — Annual AML/CFT Return",
      "Plan for ongoing obligation to submit the Annual AML/CFT Return after registration.",
      "NOC Reg 18.1(c) / Form A6",
    ),
    reg(
      "noc-a7-isar",
      "goAML / Reporting",
      "Form A7 — Internal Suspicious Activity Report (ISAR) process",
      "Internal escalation template/process aligned with Form A7 before external STR filing.",
      "NOC Reg / Form A7",
    ),
    reg(
      "noc-a8",
      "Fit & Proper",
      "Form A8 — Key Individual appointment / change process",
      "Process to notify appointments and changes of Key Individuals using Form A8.",
      "NOC Reg / Form A8",
    ),
    reg(
      "noc-business-plan",
      "Form A1",
      "Business plan / activity description",
      "Describe intended Virtual Asset Services, group structure, and main business activities as required in the application.",
      "Section 19(1)–(2) / Form A1",
      true,
      "statutory",
      "act",
    ),
    reg(
      "noc-systems",
      "Systems",
      "AML-relevant systems description",
      "Describe systems for blockchain analytics, identity verification, sanctions/TFS screening, transaction monitoring, data storage/backup, and information security.",
      "Form A1 §6.2",
    ),
    item({
      id: "noc-aml-registered-path",
      section: "Pathway",
      label: "Confirm AML-Registered Services pathway (if applicable)",
      description:
        "After NOC and goAML registration, only Exchange, Broker-Dealer, Custody, and Derivatives may be provided as AML-Registered Services before full licence. All other Schedule I services require a full licence first. Verify current PVARA conditions.",
      required: true,
      sourceInstrument: "noc_regulations",
      sourceSection: "NOC Reg 2.3 / 15.4",
      confidence: "regulation",
    }),
  ];
}

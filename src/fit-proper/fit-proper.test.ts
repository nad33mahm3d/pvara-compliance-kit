import { describe, expect, it } from "vitest";
import {
  assessFitProperCompleteness,
  createFitProperQuestionnaire,
  exportFitProperMarkdown,
  FIT_PROPER_QUESTIONS,
} from "./questionnaire.js";

describe("fit-proper Form A3 builder", () => {
  it("exposes interactive questions covering Form A3 sections", () => {
    expect(FIT_PROPER_QUESTIONS.length).toBeGreaterThan(10);
    expect(FIT_PROPER_QUESTIONS.some((q) => q.id === "a3-declaration")).toBe(true);
  });

  it("creates an empty questionnaire for a role", () => {
    const q = createFitProperQuestionnaire("mlro", { fullName: "A. MLRO" });
    expect(q.formId).toBe("A3");
    expect(q.role).toBe("mlro");
    expect(q.declarationAccepted).toBe(false);
  });

  it("flags incompleteness and adverse yes answers without auto-failing", () => {
    const q = createFitProperQuestionnaire("ceo", {
      fullName: "Test CEO",
      dateOfBirth: "1980-01-01",
      nationality: "PK",
      residentialAddress: "Islamabad",
      beenWarnedOrReprimanded: "yes",
      beenRefusedLicence: "no",
      criminalConviction: "no",
      underInvestigation: "no",
      declaredBankrupt: "no",
      conflictsWithShareholdersOrManagement: "no",
      medicallyFit: "yes",
      employmentHistory: [
        {
          employerName: "Prior Co",
          country: "PK",
          positionHeld: "CEO",
          startDate: "2015-01-01",
          keyResponsibilities: "Ops",
        },
      ],
      academicQualifications: [
        { title: "BSc", institution: "University" },
      ],
      professionalReferences: [
        {
          name: "Ref One",
          organisation: "Bank",
          relationship: "Former supervisor",
        },
      ],
      declarationAccepted: true,
    });

    const result = assessFitProperCompleteness(q);
    expect(result.complete).toBe(true);
    expect(result.blockingYesAnswers[0]).toMatch(/regulatory warning/);
  });

  it("exports markdown", () => {
    const md = exportFitProperMarkdown(
      createFitProperQuestionnaire("cfo", { fullName: "CFO" }),
    );
    expect(md).toContain("Form A3");
    expect(md).toContain("CFO");
  });
});

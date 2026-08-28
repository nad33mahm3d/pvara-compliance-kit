/**
 * Example: Form A3 Fit & Proper draft + TFS stub + segregation checklist.
 * Run: npx tsx examples/v02-modules.ts
 */

import {
  LEGAL_DISCLAIMER,
  assessFitProperCompleteness,
  createFitProperQuestionnaire,
  createEmptyCapitalFeeMatrix,
  getSegregationChecklist,
  getFrtChecklist,
  recommendPathway,
  StubTfsScreeningAdapter,
  createScreeningRequest,
} from "../src/index.js";

console.log(LEGAL_DISCLAIMER);

const q = createFitProperQuestionnaire("mlro", {
  fullName: "Example MLRO",
  dateOfBirth: "1985-05-05",
  nationality: "PK",
  residentialAddress: "Karachi",
  beenWarnedOrReprimanded: "no",
  beenRefusedLicence: "no",
  criminalConviction: "no",
  underInvestigation: "no",
  declaredBankrupt: "no",
  conflictsWithShareholdersOrManagement: "no",
  medicallyFit: "yes",
  employmentHistory: [
    {
      employerName: "Prior VASP",
      country: "PK",
      positionHeld: "Compliance",
      startDate: "2018-01-01",
      keyResponsibilities: "AML programme",
    },
  ],
  academicQualifications: [{ title: "LLB", institution: "University" }],
  professionalReferences: [
    { name: "Ref", organisation: "Bank", relationship: "Supervisor" },
  ],
  declarationAccepted: true,
});
console.log("Form A3 complete?", assessFitProperCompleteness(q).complete);

const adapter = new StubTfsScreeningAdapter();
const screen = await adapter.screen(
  createScreeningRequest({
    requestId: "demo-1",
    screenedAt: new Date().toISOString(),
    subjects: [{ subjectId: "1", fullName: "Example MLRO", walletAddresses: [] }],
  }),
);
console.log("TFS stub clear?", screen.clear);

console.log(
  "Pathway:",
  recommendPathway({
    novelOrPilotModel: true,
    seeksSupervisedLiveTesting: true,
    seeksNoActionComfort: false,
    standardScheduleIServices: false,
  }).primary,
);

console.log("Segregation items:", getSegregationChecklist("custody").length);
console.log("FRT items:", getFrtChecklist().length);
console.log(
  "Capital matrix complete?",
  createEmptyCapitalFeeMatrix().capitalByCategory.length === 10,
);

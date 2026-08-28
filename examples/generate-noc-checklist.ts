/**
 * Example: generate an NOC checklist and export Markdown progress.
 *
 * Run: npx tsx examples/generate-noc-checklist.ts
 */

import {
  exportChecklist,
  getNocChecklist,
  getTransitionalDeadlineInfo,
  setChecklistItemStatus,
  LEGAL_DISCLAIMER,
} from "../src/index.js";

console.log(LEGAL_DISCLAIMER);
console.log("");

let checklist = getNocChecklist();
checklist = setChecklistItemStatus(checklist, "noc-a1", "in_progress");
checklist = setChecklistItemStatus(checklist, "noc-tfs", "not_started");

console.log(exportChecklist(checklist, "markdown"));

console.log("---");
console.log(
  JSON.stringify(
    getTransitionalDeadlineInfo({
      // Pass only dates you have verified from official PVARA publications:
      // portalCutoffDate: "YYYY-MM-DD",
    }),
    null,
    2,
  ),
);

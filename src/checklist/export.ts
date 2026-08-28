/**
 * Checklist export helpers.
 * Not legal advice. See DISCLAIMER.md.
 */

import { LEGAL_DISCLAIMER, type ChecklistItem } from "../types.js";

export type ChecklistState = ChecklistItem[];

/**
 * Serialize checklist state to JSON or a Markdown progress document.
 */
export function exportChecklist(
  state: ChecklistState,
  format: "json" | "markdown",
): string {
  if (format === "json") {
    return JSON.stringify(
      {
        disclaimer: LEGAL_DISCLAIMER,
        exportedAt: new Date().toISOString(),
        items: state,
      },
      null,
      2,
    );
  }

  const lines: string[] = [
    "# Compliance checklist progress",
    "",
    `> ${LEGAL_DISCLAIMER}`,
    "",
    `| Status | Count |`,
    `| --- | --- |`,
    `| complete | ${state.filter((i) => i.status === "complete").length} |`,
    `| in_progress | ${state.filter((i) => i.status === "in_progress").length} |`,
    `| not_started | ${state.filter((i) => i.status === "not_started").length} |`,
    "",
  ];

  const sections = [...new Set(state.map((i) => i.section ?? "General"))];
  for (const section of sections) {
    lines.push(`## ${section}`, "");
    for (const i of state.filter((x) => (x.section ?? "General") === section)) {
      const box =
        i.status === "complete" ? "[x]" : i.status === "in_progress" ? "[~]" : "[ ]";
      lines.push(
        `- ${box} **${i.label}** (\`${i.id}\`) — ${i.status}`,
        `  - ${i.description}`,
        `  - Source: ${i.sourceSection} (${i.sourceInstrument}, confidence: ${i.confidence})`,
        "",
      );
    }
  }

  return lines.join("\n");
}

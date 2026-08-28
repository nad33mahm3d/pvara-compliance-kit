/**
 * Checklist module — NOC (A1–A8), licence application, export, transitional helper.
 * Not legal advice. See DISCLAIMER.md.
 */

import type { ChecklistItem, ChecklistItemStatus } from "../types.js";
import { LEGAL_DISCLAIMER } from "../types.js";

export { LEGAL_DISCLAIMER };
export { getNocChecklist } from "./noc-checklist.js";
export { getLicenseChecklist } from "./license-checklist.js";
export { exportChecklist, type ChecklistState } from "./export.js";
export {
  getTransitionalDeadlineInfo,
  type TransitionalDeadlineInfo,
} from "./transitional.js";

/**
 * Update status on a checklist item by id (immutable).
 */
export function setChecklistItemStatus(
  state: ChecklistItem[],
  id: string,
  status: ChecklistItemStatus,
): ChecklistItem[] {
  return state.map((i) => (i.id === id ? { ...i, status } : i));
}

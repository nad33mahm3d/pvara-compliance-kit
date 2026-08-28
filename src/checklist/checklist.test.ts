import { describe, expect, it } from "vitest";
import {
  exportChecklist,
  getLicenseChecklist,
  getNocChecklist,
  getTransitionalDeadlineInfo,
  setChecklistItemStatus,
} from "./index.js";

describe("getNocChecklist", () => {
  it("includes Forms A1–A8 and TFS / Fit & Proper items", () => {
    const items = getNocChecklist();
    const ids = items.map((i) => i.id);
    expect(ids).toContain("noc-a1");
    expect(ids).toContain("noc-a2");
    expect(ids).toContain("noc-a3");
    expect(ids).toContain("noc-a4");
    expect(ids).toContain("noc-a5");
    expect(ids).toContain("noc-a6-awareness");
    expect(ids).toContain("noc-a7-isar");
    expect(ids).toContain("noc-a8");
    expect(ids).toContain("noc-tfs");
    expect(items.every((i) => i.status === "not_started")).toBe(true);
    expect(items.every((i) => i.sourceSection.length > 0)).toBe(true);
  });
});

describe("getLicenseChecklist", () => {
  it("returns base s.19(4) items for advisory", () => {
    const items = getLicenseChecklist("advisory");
    expect(items.map((i) => i.id)).toContain("lic-aml-framework");
    expect(items.map((i) => i.id)).not.toContain("lic-segregation-awareness");
  });

  it("adds segregation item for custody/exchange", () => {
    expect(
      getLicenseChecklist("custody").map((i) => i.id),
    ).toContain("lic-segregation-awareness");
    expect(
      getLicenseChecklist("exchange").map((i) => i.id),
    ).toContain("lic-aml-registered-transition");
  });

  it("adds issuance planning item for issuance category", () => {
    expect(getLicenseChecklist("issuance").map((i) => i.id)).toContain(
      "lic-issuance-whitepaper",
    );
  });
});

describe("exportChecklist", () => {
  it("exports JSON with disclaimer", () => {
    const state = setChecklistItemStatus(getNocChecklist(), "noc-a1", "complete");
    const json = JSON.parse(exportChecklist(state, "json")) as {
      disclaimer: string;
      items: { id: string; status: string }[];
    };
    expect(json.disclaimer).toMatch(/not legal advice/i);
    expect(json.items.find((i) => i.id === "noc-a1")?.status).toBe("complete");
  });

  it("exports Markdown progress", () => {
    const md = exportChecklist(getNocChecklist(), "markdown");
    expect(md).toContain("# Compliance checklist progress");
    expect(md).toContain("noc-tfs");
  });
});

describe("getTransitionalDeadlineInfo", () => {
  it("documents s.70 without inventing portal cutoffs", () => {
    const info = getTransitionalDeadlineInfo();
    expect(info.actSection).toBe("Section 70");
    expect(info.portalCutoffDate).toBeUndefined();
    expect(info.portalCutoffNote).toMatch(/No portal cutoff/);
  });

  it("echoes caller-supplied portal cutoff", () => {
    const info = getTransitionalDeadlineInfo({ portalCutoffDate: "2026-09-05" });
    expect(info.portalCutoffDate).toBe("2026-09-05");
    expect(info.portalCutoffNote).toMatch(/2026-09-05/);
  });
});

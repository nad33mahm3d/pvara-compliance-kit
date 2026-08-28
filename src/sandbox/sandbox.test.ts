import { describe, expect, it } from "vitest";
import {
  getNoActionChecklist,
  getSandboxChecklist,
  recommendPathway,
} from "./pathway.js";

describe("sandbox pathway", () => {
  it("defaults standard Schedule I to NOC/licence", () => {
    const r = recommendPathway({
      novelOrPilotModel: false,
      seeksSupervisedLiveTesting: false,
      seeksNoActionComfort: false,
      standardScheduleIServices: true,
    });
    expect(r.primary).toBe("noc_licence");
  });

  it("recommends sandbox for novel supervised testing", () => {
    const r = recommendPathway({
      novelOrPilotModel: true,
      seeksSupervisedLiveTesting: true,
      seeksNoActionComfort: false,
      standardScheduleIServices: false,
    });
    expect(r.primary).toBe("sandbox");
    expect(r.sourceSection).toBe("Section 35");
  });

  it("recommends no-action when sought for novel pilots", () => {
    const r = recommendPathway({
      novelOrPilotModel: true,
      seeksSupervisedLiveTesting: false,
      seeksNoActionComfort: true,
      standardScheduleIServices: false,
    });
    expect(r.primary).toBe("no_action_letter");
  });

  it("exposes sandbox and no-action checklists", () => {
    expect(getSandboxChecklist().map((i) => i.id)).toContain("sbx-aml");
    expect(getNoActionChecklist().map((i) => i.id)).toContain("nal-counsel");
  });
});

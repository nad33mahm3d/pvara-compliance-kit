# Regulatory summary (plain language)

> **Not legal advice.** This summary is a structuring aid for engineers and compliance teams. It is not affiliated with or endorsed by PVARA. Always verify against the current Act, regulations, and official portal guidance. See [DISCLAIMER.md](../DISCLAIMER.md).

**Citation snapshot:** as of `2026-08-28` (kit v0.2.0).

## What the Act does

The **Virtual Assets Act, 2026** establishes the **Pakistan Virtual Assets Regulatory Authority (PVARA)** to license, regulate, and supervise Virtual Assets (VAs) and Virtual Asset Service Providers (VASPs) in or from Pakistan.

- **Virtual Asset** — broadly, a digital representation of value that can be traded or transferred and used for payment or investment (not legal tender). Certain exclusions apply (e.g. closed-ecosystem tokens, CBDCs, pure NFTs used neither for payment nor investment) — substance over form.
- **VASP** — any person who, as a business, provides one or more Virtual Asset Services to third parties on a professional basis.

Primary references: Act definitions; Section 18 / Schedule I (service categories); Section 2 (application).

## Ten licence categories (Schedule I / Section 18)

1. Advisory services  
2. Broker-dealer services  
3. Custody and administration services  
4. Exchange services  
5. Lending and borrowing services  
6. Virtual asset derivatives services  
7. Management and investment services  
8. Transfer and settlement services  
9. Virtual asset issuance services  
10. Mining-related services  

Carrying on these activities without a licence is a criminal offence under the Act. Category definitions include important carve-outs (e.g. self-custody; proprietary trading without customer assets; pure own-account mining; general education vs personalised advice). Use this kit’s `classify()` rules engine only as a structuring aid.

## Licensing pathway

### Stage 1 — No-Objection Certificate (Section 19(1))

Before incorporating a company whose primary objective is Virtual Asset Services, apply to PVARA for an **NOC**. Application form, prescribed information, and fee are set by the Authority.

Published **NOC Regulations** expand this into Forms **A1–A8**, covering AML registration, Controllers (typically **20%+**), Fit & Proper for Key Individuals, AML/CFT framework, outsourcing, annual return awareness, ISAR, and Key Individual changes.

### AML-Registered Services (NOC Regulations)

After NOC issuance and **FMU goAML** registration, four services may be designated for a phased pathway before full licence (subject to PVARA conditions):

- Exchange  
- Broker-dealer  
- Custody  
- Derivatives  

**All other Schedule I services require a full licence first.** Verify current conditions on the official portal.

### Stage 2 — Full licence (Section 19(4))

After incorporation, submit the full licence application with prescribed documentation (corporate documents, business plan, ownership, AML/CFT framework, key personnel, IT/cybersecurity) and non-refundable fee. PVARA may grant full, provisional/limited-scope, or refuse with reasons (see also Section 21).

## Fit and proper (Section 20) / Key Individuals (NOC Regs)

Fit-and-proper assessment is ongoing. Controllers, Sponsors, CEO, and Directors are directly assessed; licensees assess other Key Individuals (including MLRO / AML compliance officer). At least one Key Individual ordinarily resident in Pakistan must hold operational authority (Act). NOC Regs list required Key Individual roles and Form A3 questionnaires.

## AML / CFT / CPF (Chapter 8)

VASPs are deemed **financial institutions** under the **Anti-Money Laundering Act, 2010** (Section 46). Obligations include CDD/EDD, STR reporting to FMU, record-keeping, internal controls, and appointment of an AML/CFT/CPF compliance officer / MLRO.

### Travel Rule (Section 47)

Licensees must obtain, hold, and transmit originator and beneficiary information for VA transfers meeting or exceeding the **threshold prescribed by PVARA**, consistent with FATF Recommendations (updated from time to time), while complying with applicable data-protection and cybersecurity laws. **This toolkit never hardcodes the threshold as permanent law** — pass the current value into `validateTravelRulePayload`.

Record retention must be at least the AMLA period; NOC materials commonly reference a **7-year** minimum — confirm current prescription.

### goAML

STR/CTR filing via FMU **goAML** is an operational requirement. This kit’s `goaml/` module is **best-effort structure only** — not official FMU XML and not a submission client.

## Transitional provisions (Section 70)

Persons providing Virtual Asset Services immediately before commencement must apply within **six months** of commencement or cease. Complete applications within that window may allow continued existing services subject to interim directives. Portal guidance may publish specific incumbent NOC cutoffs — pass those into `getTransitionalDeadlineInfo({ portalCutoffDate })` only after verifying official sources.

## Modules added in kit v0.2 (structuring only)

| Topic | Kit module | Notes |
| --- | --- | --- |
| Fit & Proper Form A3 | `fit-proper/` | Completeness builder — not a fitness determination |
| TFS / sanctions | `tfs/` | Adapter interface + procedure checklist — no list data |
| Segregation / PoR | `segregation/` | ss.24–27 checklists + draft PoR record |
| Sandbox / no-action | `sandbox/` | Section 35 pathway heuristic + checklists |
| Token issuance | `issuance/` | FRT/ART/whitepaper checklists |
| Capital / fees | `capital/` | Caller-supplied matrices only |

**Still not in kit:** live TFS screening, cryptographic PoR proofs, portal filings, hardcoded official PKR fee tables.

## Contributing updates

When updating checklists or thresholds, cite the specific instrument and section (Act section, NOC Regulation, Form id, or official notification) and update `CITATION_AS_OF` / item `asOfDate` fields. Prefer accuracy over completeness — do not invent fees or thresholds.

# pvara-compliance-kit

> Pakistan's Virtual Assets Act, 2026 created a real licensing regime for VASPs — but almost no open tooling exists to help teams structure compliance work. This is a starting toolkit for engineers and compliance teams, not legal advice.

**Structuring and checklist tool — not a legal-advice engine.** It does not certify compliance, file applications, or replace counsel. Read [DISCLAIMER.md](./DISCLAIMER.md). **Not affiliated with or endorsed by PVARA.**

## What this is / isn't

| Is | Isn't |
| --- | --- |
| Typed checklists for NOC (Forms A1–A8) and licence applications | A guarantee you will be licensed |
| Deterministic Schedule I classifier (rules engine) | An LLM or free-text “are we regulated?” oracle |
| Travel Rule / KYC / goAML **data shapes** | FMU submission or NADRA verification |
| Form A3 builder, TFS adapter interfaces, segregation/PoR/sandbox/issuance checklists | Live TFS screening or official fee tables |
| Citation metadata so requirements can be audited | A fitness, licence, or PoR attestation |

Thresholds, fees, and document lists change. **Always verify against PVARA’s current published regulations** before relying on this kit.

## Install

```bash
npm install pvara-compliance-kit
```

Requires Node.js 20+.

## Quickstart

```ts
import {
  classify,
  getNocChecklist,
  exportChecklist,
  validateTravelRulePayload,
  LEGAL_DISCLAIMER,
} from "pvara-compliance-kit";

console.log(LEGAL_DISCLAIMER);

// 1) Classify a structured business profile (no free text)
const { results, exemptionsApplied } = classify({
  operatesExchangeOrOrderBook: "yes",
  holdsCustomerKeysOrAssets: "yes",
  selfCustodyOnly: "no",
});

// 2) Generate NOC checklist and export progress
const checklist = getNocChecklist();
console.log(exportChecklist(checklist, "markdown"));

// 3) Validate Travel Rule payload — pass the current PVARA threshold yourself
const tr = validateTravelRulePayload(
  {
    originator: {
      name: { primaryIdentifier: "Ali" },
      accountNumber: "0xabc",
    },
    beneficiary: {
      name: { primaryIdentifier: "Sara" },
      accountNumber: "0xdef",
    },
  },
  750_000,
  /* threshold: verify current PVARA prescription before use */ 500_000,
);
```

Examples in [`examples/`](./examples/):

- `classify-business.ts`
- `generate-noc-checklist.ts`
- `validate-travel-rule-payload.ts`

## Ten licence categories (Schedule I)

1. **Advisory** — personalised VA recommendations (not general education alone)  
2. **Broker-dealer** — arranging/facilitating orders, market-making, placement (*AML-Registered eligible*)  
3. **Custody** — safekeeping VAs/keys for customers (*AML-Registered eligible*)  
4. **Exchange** — VA↔fiat / VA↔VA matching / order book (*AML-Registered eligible*)  
5. **Lending and borrowing**  
6. **Derivatives** — VA futures, options, swaps, CFDs, etc. (*AML-Registered eligible*)  
7. **Management and investment** — discretionary management / staking  
8. **Transfer and settlement**  
9. **Issuance** — create/offer/administer VAs  
10. **Mining-related** — mining services involving customer assets/funds  

After NOC + goAML registration, only the four **AML-Registered** categories above may be available on a phased pathway before full licence — confirm current PVARA conditions. See [`docs/regulatory-summary.md`](./docs/regulatory-summary.md).

## Modules

| Module | Purpose |
| --- | --- |
| `classifier/` | Rules engine + exemptions + `amlRegisteredEligible` flags |
| `checklist/` | NOC (A1–A8, TFS, Fit & Proper), licence checklist, export, s.70 helper |
| `fit-proper/` | Interactive Form A3 questionnaire builder + completeness check |
| `tfs/` | TFS screening **adapter interface** + procedure checklist (no list data) |
| `segregation/` | Customer asset segregation / PoR checklists (ss.24–27) |
| `sandbox/` | Section 35 sandbox / no-action pathway helper + checklists |
| `issuance/` | FRT / ART / whitepaper structuring checklists |
| `capital/` | Caller-supplied capital & fee matrices (no hardcoded PKR amounts) |
| `travel-rule/` | Zod originator/beneficiary payload + configurable threshold check |
| `kyc/` | Individual/entity CDD field schemas + CNIC **format** check |
| `goaml/` | Best-effort STR / CTR / ISAR shapes (least certain module) |

## Development

```bash
npm install
npm test
npm run lint
npm run build
```

## Contributing

PVARA’s subsidiary regulations are still evolving. PRs that keep checklists current are welcome.

When you update a checklist item, threshold note, or category rule:

1. Cite the **specific** Act section, NOC Regulation, Form id, or official notification.  
2. Set `sourceInstrument`, `sourceSection`, `confidence`, and `asOfDate`.  
3. Prefer leaving a field as “verify with PVARA” over inventing a fee or threshold.  
4. Do not claim affiliation with PVARA.

## Publishing releases

CI runs on every push/PR. **npm publish** runs from [`.github/workflows/publish.yml`](./.github/workflows/publish.yml) when you publish a GitHub Release.

### One-time: connect Trusted Publishing (recommended)

1. Open https://www.npmjs.com/package/pvara-compliance-kit → **Settings** → **Trusted Publisher**
2. Choose **GitHub Actions** and set:
   - **Organization or user:** `nad33mahm3d`
   - **Repository:** `pvara-compliance-kit`
   - **Workflow filename:** `publish.yml` (filename only)
   - Allow **npm publish**
3. No long-lived npm token needed for CI after this. Provenance is generated automatically.

Optional fallback: add repo secret `NPM_TOKEN` (granular token with Bypass 2FA) if Trusted Publishing is not configured yet.

### Cut a release

1. Bump `"version"` in `package.json` (e.g. `0.2.1`) and push to `main`
2. Create a GitHub Release whose tag matches that version (`v0.2.1` or `0.2.1`)
3. The Publish workflow runs tests/build and publishes to npm

```bash
# example
npm version patch --no-git-tag-version   # or edit package.json by hand
git add package.json package-lock.json
git commit -m "Release 0.2.1"
git push origin main
gh release create v0.2.1 --generate-notes
```

## Still out of kit scope

- Live sanctions list data or vendor SDKs (wire your own `TfsScreeningAdapter`)  
- Cryptographic PoR proofs or auditor sign-off  
- Official PVARA fee/capital PKR tables (inject via `parseCapitalFeeMatrix`)  
- Filing to PVARA / FMU portals  

## License

MIT — see [LICENSE](./LICENSE). Disclaimer: [DISCLAIMER.md](./DISCLAIMER.md).

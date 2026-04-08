# Classification Modal — UI Spec (✅ Implemented)

---

## Modal States

```
IDLE → LOADING → REVIEW → APPROVED
```

### IDLE
- Shows task description
- "Asset Classification" card with icon + subtext + purple "Run classification" button (`bg-[#7c6fc4]`)
- Footer: Cancel only (no Save)

### LOADING
- Same card but button replaced with `Loader2 animate-spin` + "SAUL is classifying assets..."
- Footer: Cancel only

### REVIEW
Two sections in the left panel:

**Section 1 — Blocked paths** (only if `plan.blocked_paths` is non-empty)
- Gray card with `Ban` icon + "BLOCKED PATHS" label
- Each path: `procedure — reason` in `text-sm`

> **Note:** The "Missed deadline" flag banner was removed — not relevant to this flow.

**Section 2 — Asset table**
- 3-column div-based grid: `grid-cols-[1fr_140px_90px]`
- Columns: Asset (+ reason in muted subtext) | Bucket (dropdown) | Confidence
- Bucket dropdown: colored badge using `BUCKET_CONFIG` — `<select>` inside a colored `inline-flex` container with `ChevronDown` overlay
- Confidence: colored dot (`w-2 h-2 rounded-full`) + label
- Low confidence rows (`< 0.70`): `bg-red-50/40` row tint
- Override: changing bucket reveals inline required text input below that row; button disabled until filled
- Reverting bucket to original removes the override requirement

Footer (REVIEW state):
```
[N assets classified · N low confidence]    [Approve classification →]
```
- Approve button: `bg-[#1a1a2e]`, disabled (`opacity-50 cursor-not-allowed`) while any override is missing a reason

### APPROVED
- Centered `CheckCircle2` (green) + "Classification approved" + "Closing..."
- Auto-closes modal after 2 seconds, resets all classification state
- Footer: hidden

---

## Implementation Details

**State hooks** (in `EstateManagementPage`):
```typescript
const [classificationState, setClassificationState] = useState<"idle"|"loading"|"review"|"approved">("idle")
const [classificationData, setClassificationData] = useState<typeof SAUL_CLASSIFICATION_RESPONSE | null>(null)
const [bucketOverrides, setBucketOverrides] = useState<Record<number, string>>({})
const [overrideReasons, setOverrideReasons] = useState<Record<number, string>>({})
```

**Key handlers:**
- `resetClassificationState()` — called on modal open AND close (all paths)
- `handleRunClassification()` — sets loading, setTimeout 2500ms, then sets data + review
- `handleApproveClassification()` — sets approved, setTimeout 2000ms, closes + resets

**Conditional rendering trigger:**
```tsx
task.slug === "confirm_asset_classification"
```
Checked in the left panel and footer inside the task modal IIFE.

**Mock data constant:** `SAUL_CLASSIFICATION_RESPONSE` — defined after `JOBS_BOARD_TASKS` in `app/page.tsx`

---

## Open Questions (Resolved)

1. **Where does "Run classification" live in IDLE state?** → In the left panel, replacing the Steps section. Right sidebar and header unchanged.

2. **Does the manual checklist stay visible in REVIEW state?** → No — replaced entirely.

3. **What does the approved state look like before the modal closes?** → Brief green success message for 2 seconds, then auto-close.

4. **Should missed deadline flags show?** → No — removed from the UI.

---

## Next Modal to Build: Determine the Legal Administration Path

**Slug:** `determine_the_path_of_legal_administration_applicable_to_the_decedent`
**Task ID:** `t1`

This is the natural next step after asset classification. SAUL's classification response already includes `plan.actions` and `plan.blocked_paths` which can inform the legal path. The modal should follow the same IDLE → LOADING → REVIEW → APPROVED pattern.

Possible inputs to SAUL for legal path determination:
- Classified asset buckets (from prior step)
- Estate gross value
- Jurisdiction / state of domicile
- Whether a will or trust exists
- Whether there's a surviving spouse

Possible SAUL outputs:
- Recommended legal path(s): Probate (Independent/Supervised), Trust Administration, Small Estate Affidavit, Ancillary Probate
- Required filings / forms
- Jurisdiction-specific thresholds and timelines

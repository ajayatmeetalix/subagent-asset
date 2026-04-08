# CLAUDE.md — Estate Manager Prototype

This is a prototype. There is no full backend. Mock all SAUL API calls using sample JSON defined as constants in `app/page.tsx`.

---

## What's Been Built

### Confirm Asset Classification (✅ Shipped — commit 6a85b9a)

A job modal in Estate Manager (Next.js, port 3939) that replaces a manual checklist with a SAUL-driven asset classification review UI.

**Flow:**
1. Specialist opens the "Confirm Asset Classification" modal → sees description + "Run classification" button
2. Clicks "Run classification" → 2.5s simulated delay → SAUL mock response loads
3. Modal renders: blocked paths banner + asset table with bucket dropdowns and confidence indicators
4. Specialist can override any bucket (requires a reason per override)
5. Clicks "Approve classification" → 2s success state → modal closes

### Next: Determine the Legal Administration Path (🔜 Planned)

The next job in the sequence. After asset classification is approved, a specialist needs to determine the correct legal administration path for the estate. This is a SAUL-driven automation candidate — SAUL already returns `plan.actions` and `plan.blocked_paths` as part of the classification response, which can seed the legal path determination.

---

## Codebase at a Glance

| | |
|---|---|
| **Framework** | Next.js (App Router), single `app/page.tsx` file (~4,800 lines), `'use client'` |
| **Styling** | Tailwind CSS v4, hardcoded hex colors throughout (see palette below) |
| **UI Library** | shadcn/ui — only `Button` (`components/ui/button.tsx`) and `Input` (`components/ui/input.tsx`) are used |
| **Icons** | Lucide React |
| **State** | React `useState` only — no Redux, no Context |
| **Dev server** | `npx next dev -p 3939` (configured in `.claude/launch.json`) |

**Color palette:**
- Dark: `#1a1a2e`, `#3d3d3d`, `#2d2d4e`
- Muted text: `#6b675f`, `#9b9b9b`
- Borders: `#e5e5e5`, `#d0d0d0`, `#f0f0f0`
- Light bg: `#f8f7f5`, `#fafafa`
- Accent purple: `#7c6fc4`, `#5a4fa0`

**Modal pattern** (used throughout — no Radix Dialog):
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeModal}>
  <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
       onClick={e => e.stopPropagation()}>
    {/* header | body (left panel + right sidebar) | footer */}
  </div>
</div>
```

---

## Key Files

| File | What it contains |
|---|---|
| `app/page.tsx` | Entire app — all components, state, modals, data |
| `components/ui/button.tsx` | shadcn Button with CVA variants |
| `components/ui/input.tsx` | shadcn Input |
| `asset_classification_feature.md` | SAUL output schema, mock JSON, bucket/confidence display rules |
| `classification_modal_ui_spec.md` | Modal states, component layout, implementation decisions |
| `.claude/launch.json` | Dev server config (port 3939) |

---

## Jobs Board Data Model

Tasks are defined in the `JOBS_BOARD_TASKS` array (top of `app/page.tsx`):

```typescript
{
  id: string           // "t1", "t2", etc.
  slug: string         // used to conditionally render custom modal UIs
  title: string
  assignee: string
  assigneeEmail: string
  reviewer: string
  createdAt: string
  updatedAt: string
  status: "todo" | "in-progress" | "awaiting-review" | "completed"
  priority: string
  jobVersion: number
  jobId: string        // UUID
  steps: { done: number; total: number }
  description: string
  stepItems: Array<{ id: number; text: string }>
}
```

**Current tasks:**
- `t1` — `determine_the_path_of_legal_administration_applicable_to_the_decedent` (To Do)
- `t2` — `confirm_asset_classification` (To Do) ← has custom SAUL UI
- `c1–c3` — completed tasks

**Pattern for custom modal UIs:** check `task.slug === "your_slug"` inside the modal IIFE to swap out the left panel content and footer.

---

## Asset Buckets (enum)

| Enum | Label | Badge colors |
|---|---|---|
| `PROBATE` | Probate | gray-100 / gray-600 |
| `TRUST` | Trust | purple-50 / purple-700 |
| `SMALL_ESTATE_AFFIDAVIT` | Small estate affidavit | blue-50 / blue-600 |
| `POD_TOD` | POD / TOD | green-50 / green-700 |
| `COMMUNITY_PROPERTY` | Community property | teal-50 / teal-700 |
| `JOINT_TENANCY` | Joint tenancy | teal-50 / teal-700 |
| `SPOUSAL_TRANSFER` | Spousal transfer | teal-50 / teal-700 |

Defined as `BUCKET_CONFIG` constant in `app/page.tsx` (after `JOBS_BOARD_TASKS`).

---

## SAUL Mock Pattern

All SAUL responses are hardcoded constants defined outside the component, then loaded via `setTimeout` to simulate network delay:

```typescript
const SAUL_RESPONSE = { ... } // hardcoded at top of file

const handleRunSaul = () => {
  setState("loading")
  setTimeout(() => {
    setData(SAUL_RESPONSE)
    setState("review")
  }, 2500)
}
```

---

## Prototype Conventions

- No real API calls, no real auth, no real state persistence
- Mock SAUL responses as top-level constants in `app/page.tsx`
- Simulate 2–3 second loading delays
- All state lives in the main `EstateManagementPage` component via `useState`
- When adding a new SAUL-driven job modal: add state hooks near line ~243, handlers near line ~256, and conditional rendering inside the task modal IIFE (around line ~3050)

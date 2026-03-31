# PRD: Estate Legal Profile

**Status:** Draft
**Date:** 2026-03-31
**Author:** Ajay Nichani

---

## Overview

The Estate Legal Profile is a structured reference view within each estate's detail page that consolidates the legal and procedural information needed to manage an estate through probate. It gives attorneys and paralegals a single place to find authority type, court contact details, referee assignments, and key legal dates — without digging through email threads, physical filings, or asking colleagues.

---

## Problem Statement

Legal case details for probate estates are currently stored in fragmented places: email, physical court paperwork, notes apps, or memory. There is no structured home for this information within the platform. This creates friction when:

- Answering client questions about their case status or court details
- Coordinating between attorneys, paralegals, and courts
- Onboarding a new team member to an active estate
- Auditing case files or preparing for court appearances

### Onboarding Gap

When a new team member is assigned to an active estate, there is no structured source of truth to orient themselves. They need to interrupt colleagues to get basic answers: Which court is handling this? What authority type was granted? Is there a bond? Who is the probate referee? The Estate Legal Profile eliminates this by making those facts immediately accessible to anyone on the team.

---

## Goals

- Give attorneys and paralegals a structured place to record and access legal case details
- Reduce time spent locating or re-communicating basic facts about an estate
- Surface key dates and milestones in legal context without duplicating Timeline data
- Establish a structured data foundation for future automation and research integrations

---

## Non-Goals (v1)

- Auto-populating fields from court systems or public records
- Integration with court e-filing systems
- Displaying jurisdiction-level thresholds or statutory data
- Replacing milestone, deadline, or key date tracking (owned by Timeline)
- Generating court documents or correspondence

---

## Feature Description

The Estate Legal Profile is accessible via **Legal** in the estate sidebar navigation. It renders inline within the estate layout — consistent with Documents and other estate sub-views. There is no full-page takeover.

The view contains four sections: three independently editable cards and one read-only card sourced from Timeline.

---

### Card 1: Legal Authority

Captures the authority type granted and core case identifiers.

| Field | Type | Notes |
|---|---|---|
| Authority Type | Select | Probate (Independent), Probate (Supervised), Small Estate Affidavit, Trust Administration, Ancillary Probate, Conservatorship, Other |
| Case Number | Text | Assigned by the court |
| Jurisdiction | Text | Full court name (e.g., Essex County Surrogate's Court) |
| Bond Required | Toggle | Yes / No |
| Bond Amount | Currency | Only shown when Bond Required = Yes |

---

### Card 2: Court Details

Captures contact and logistical information for the probate court handling the estate.

| Field | Type | Notes |
|---|---|---|
| Street Address | Text | |
| City | Text | |
| State | Text | |
| ZIP | Text | |
| Phone Number | Text | Direct line or main court number |
| Website | URL | Links to court's public site |
| Hours of Operation | Preset + Notes | Standard hours selected from dropdown; optional free-text field for exceptions |

**Hours of Operation:** Rather than a free-text field — which leads to inconsistent, hard-to-parse data — hours are entered as a preset dropdown of common court schedules (e.g., Mon–Fri, 8:30am–4:30pm) plus an optional exception notes field for deviations (e.g., "Closed 12–1pm for lunch"). This balances data consistency with real-world flexibility.

---

### Card 3: Probate Referee

Captures contact information for the assigned probate referee, when applicable. Can be left blank if no referee has been assigned yet.

| Field | Type | Notes |
|---|---|---|
| Referee Name | Text | |
| Referee Phone | Text | |

---

### Card 4: Key Dates & Milestones *(read-only)*

A chronological view of all milestones and key dates from the estate's Timeline. This card is always read-only within the Legal Profile — it mirrors Timeline data rather than storing its own copy. A **Go to Timeline** link in the card header gives users a direct path to add or edit entries.

Milestones and key dates are visually distinguished with labels. All entries are sorted by date.

**Design rationale:** Dates like filing dates, authority grant dates, and court appearances are already captured as milestones and key dates in Timeline. Duplicating them as editable fields in Legal Authority would create two sources of truth that drift out of sync. A read-only mirror serves the quick-reference use case without introducing a data consistency problem.

---

## Editing Model

Cards 1–3 each have an independent Edit / Save / Cancel flow. Editing one card does not affect the others, and only one card can be in edit mode at a time. This lets users update a single section without risk of accidentally overwriting unrelated fields.

Card 4 is always read-only within the Legal Profile. Changes to milestones and key dates are made in Timeline.

---

## Users

**Primary:** Settlement specialists who are actively working an estate through a legal proceeding.

**Secondary:** Settlement Directors who need visibility into the legal status of estates across their book of business.

---

## User Stories

**Settlement Specialist**
- As a settlement specialist, I want to record the authority type and case number once so I don't have to reference physical files or emails each time I need them.
- As a settlement specialist, I want to look up court address, phone, and hours without leaving the platform.
- As a settlement specialist, I want to record whether a bond is required and the bond amount so anyone on the team has access to that information without asking me.
- As a settlement specialist, I want to see key legal dates alongside case details so I have full context in one place when working an active estate.

**Settlement Director**
- As a settlement director, I want to quickly understand the legal posture of any estate in my book of business without having to ask the specialist working it.
- As a settlement director, I want to see which authority type is in place and whether a bond is required so I can assess risk and status across estates at a glance.

---

## Success Metrics

- **Adoption:** % of active estates with at least one Legal Profile card fully filled in
- **Completion rate:** % of estates with all three editable cards completed
- **Onboarding speed:** Qualitative reduction in "where is X" questions when onboarding new team members (user testing)
- **Return usage:** % of attorneys and paralegals who revisit the Legal Profile on active estates at least once per week

---

## Future Considerations

### Court Directory & Auto-Fill

As more Legal Profiles are completed, the platform will accumulate structured court data across jurisdictions. This creates the foundation for auto-suggesting court address, phone, website, and hours when a jurisdiction is entered — reducing manual entry and data entry errors over time.

### Jurisdiction Thresholds

Probate thresholds (the asset value above which full probate is required), small estate affidavit limits, and other statutory values vary by state and county. These are excluded from v1 because:

- There are multiple threshold types (probate threshold, small estate affidavit, spousal set-aside, etc.)
- They are jurisdiction-level data, not case-specific — they apply to the court, not the individual estate
- Manual entry would go stale quickly and produce unreliable data

**Future state:** Thresholds should auto-populate from a maintained research data source, tied to the selected jurisdiction. The Legal Profile would surface a dedicated Thresholds card — read-only, research-backed — so attorneys can reference statutory limits in context without looking them up manually.

### Deadline Filtering in Key Dates & Milestones

The current Key Dates & Milestones card shows all Timeline entries. A future iteration could filter this view to only surface legally-relevant entries (e.g., Letters Testamentary issued, inventory filing deadline, claims bar date) — making the card more signal-dense for attorneys who primarily use the Legal Profile for case status.

### Document Linking

Allow attorneys to attach documents directly within the Legal Profile — e.g., linking the Letters Testamentary PDF to the Legal Authority card, or attaching the court order granting authority. Keeps source documents co-located with the structured data they correspond to.

---

## Open Questions

1. Should the Probate Referee card be conditionally shown only for certain authority types (e.g., Probate, not Trust Administration)?
2. Should Court Details support multiple phone numbers (e.g., main line vs. clerk direct)?
3. How should the Legal Profile handle estates with proceedings in multiple courts (e.g., ancillary probate in a second state)?

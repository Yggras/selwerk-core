---
trigger: always_on
---

# 🛡️ Code Discipline & State Management
- **Status:** Active
- **Last Updated:** 2026-03-02
- **Category:** Rule

## 1. Code Editing Discipline

Blinde Text-Replacements (`sed`, `awk`, `grep`) sind für Code-Änderungen **strikt verboten**.

### Required Workflow:
1. `view_file` – Kontext und Imports verstehen.
2. `replace_file_content` / `multi_replace_file_content` – Präzise Edits.
3. Sofort validieren (Import-Checks, xunit).

## 2. State Management & Institutional Memory

Nach jeder Session oder größerer Task-Fertigstellung:

1. **`MANAGEMENT.md`:** Task Board aktualisieren (DONE markieren).
2. **`SESSION_STATE.md`:** Aktuellen Status und „Completed Today" aktualisieren.
3. **Completion Reports:** Report in `docs/completed/` für große Tasks.
4. **Institutional Memory:** Analysen/Findings in `.agency/memory/` archivieren.

## 3. Documentation Standards

Jedes Dokument im `.agent` Hub muss einen standardisierten Header haben:

```markdown
# [Titel]
- **Status:** [Active/Draft/Archived/Historical]
- **Last Updated:** [YYYY-MM-DD]
- **Category:** [Rule/Spec/Workflow/Memory]
```

## 4. Test Coverage Policy

Ramp-up-Strategie mit Ziel 66%+ (Onion Principle):
1. **Logic Core** (Service Layer Unit Tests)
2. **API Contract** (Endpoint Validation)
3. **Frontend Vitals** (Validation Logic, Core Forms)

**Hard Requirement:** Neue Features müssen 80% Coverage anstreben.

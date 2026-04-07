# 🔄 Das „Ruckeln"-Protokoll – Continuous Improvement
- **Status:** Active
- **Last Updated:** 2026-03-02
- **Category:** Workflow

## Grundsatz
> **„Jedes Ruckeln melden"** – Jede Friktion wird sofort dokumentiert, nicht erst bei Blockern.

## Mandatory Process (für ALLE Rollen)

1. **Problem tritt auf** → SOFORT dokumentieren (nicht warten!)
2. **Template nutzen** → Siehe unten
3. **In Learnings DB eintragen** → `memory/learnings_database.md`
4. **SCRUM_MASTER benachrichtigen** → Explizit
5. **Fortfahren** → Workaround nutzen ODER an ARCHITECT eskalieren

## Template

```markdown
| ID | Kategorie | Titel | Learning / Action |
|---|---|---|---|
| LEARN-XXX-NNN | [Technisch/Prozess/Architektur/Integration/Deployment/Security/Werkzeuge/Git] | [Kurztitel] | [Beschreibung des Learnings und der Aktion] |
```

### Kategorien
- **Technisch:** Code-Level-Probleme, Framework-Quirks
- **Prozess:** Workflow-Friktionen, Kommunikation
- **Architektur:** Design-Fehler, Pattern-Verstöße
- **Integration:** API-Inkompatibilitäten, Daten-Mismatches
- **Deployment:** Container, Volumes, Netzwerk
- **Security:** Vulnerabilities, Auth-Probleme
- **Werkzeuge:** Tool-Bugs, Konfigurationsprobleme
- **Git:** Merge-Konflikte, Branch-Probleme

## Eskalationsstufen

| Dauer | Aktion |
|-------|--------|
| < 15 Min | Workaround documentieren, weiterarbeiten |
| 15–30 Min | SCRUM_MASTER benachrichtigen |
| > 30 Min | ARCHITECT einschalten, Pair-Programming |
| > 1 Std | Task pausieren, Root Cause Analysis |

---
description: Startet ein umfassendes Architektur- und Code-Review über das gesamte Vyvoo-Projekt. Erzeugt einen detaillierten Audit-Bericht.
---

# 🔍 Der "Audit" Workflow (Full Project Review)

## 📌 Beschreibung
Periodisches, manuelles Review des gesamten Vyvoo-Projekts. Der `@10_CODE_AUDITOR` liest **jede Datei**, analysiert **jedes Modul**, und produziert einen umfassenden Prüfbericht. Die Findings werden anschließend mit dem War Room Council diskutiert, bis konkrete Lösungen stehen.

> ⏱️ **Hinweis:** Dieses Review ist bewusst gründlich und darf viel Zeit in Anspruch nehmen. Qualität vor Geschwindigkeit.

> [!IMPORTANT]
> **🔄 Cross-Model Audit Regel:** Dieses Audit soll von einem **anderen KI-Modell** durchgeführt werden als dem, das den Code geschrieben hat! Gleicher Autor = gleiche blinde Flecken.
>
> | Rolle | Modell |
> |---|---|
> | Entwicklung | Gemini / Claude |
> | **Audit** | **GPT OSS 120B** (oder ein anderes nicht am Code beteiligtes Modell) |
>
> Kopiere die Datei `.agent/Collaboration/Roles/10_CODE_AUDITOR.md` als System-Prompt in das Audit-Modell und lass es den gesamten Codebase reviewen.

## 🚀 Ausführung

### Phase 1: Inventur
Der Agent liest und katalogisiert alle relevanten Dateien:

1. **Code lesen:**
   - `apps/mutterschiff-api/Program.cs` (komplett)
   - `apps/mutterschiff-web/src/` (alle Seiten, Komponenten, Layouts)
   - `apps/shuttle-web/src/` (alle Seiten, Komponenten, Layouts)
   - `docker-compose.yml`, alle `Dockerfile`s
   - `middleware.ts` (beide Apps)

2. **Tests lesen:**
   - `apps/mutterschiff-api.Tests/`
   - `apps/mutterschiff-web/tests/`
   - `tests/e2e/`
   - `.github/workflows/test.yml`

3. **Dokumentation lesen:**
   - `.agent/memory.md` (ADRs)
   - `.agent/Documentation/` (alle Docs)
   - `README.md`

4. **Konfiguration prüfen:**
   - `package.json` (alle Apps)
   - `.csproj` Dateien
   - `next.config.ts` (beide Apps)
   - `.gitignore`

### Phase 2: Analyse (8 Dimensionen)
Der `@10_CODE_AUDITOR` bewertet das Projekt über seine 8 Dimensionen:

| # | Dimension | Kern-Frage |
|---|-----------|------------|
| 1 | Architecture Health | Ist die Architektur konsistent? |
| 2 | Code Quality | Clean Code, Lesbarkeit, Konventionen? |
| 3 | Test Coverage | Was ist getestet, was nicht? |
| 4 | Security | Secrets, Auth-Checks, Vulnerabilities? |
| 5 | Project Structure | Logische Ordnung, Trennung? |
| 6 | Deployment & DevOps | Docker, CI/CD, Environments? |
| 7 | Technical Debt | Bekannte Shortcuts, TODOs, Skipped Tests? |
| 8 | Scalability Readiness | Bereit für Wachstum? |

### Phase 3: Audit-Bericht
Output: `.agent/Documentation/audit_report_[DATUM].md`

Struktur:
1. Executive Summary (3 Sätze)
2. Scorecard (8 Dimensionen mit 🟢🟡🔴)
3. Module-by-Module Review
4. Kritische Findings
5. Priorisierte Empfehlungen
6. Positive Highlights

### Phase 4: War Room Diskussion 🆕
Die Audit-Findings werden **dem War Room Council vorgelegt**. Jede Rolle kommentiert die Findings aus ihrer Perspektive:

- **`@01_LEAD_ARCHITECT`** + **`@10_CODE_AUDITOR`**: Debattieren über architekturelle Findings. Wo ist der Auditor zu streng? Wo hat er recht? Sie iterieren, bis sie sich einig sind auf **konkrete Maßnahmen**.
- **`@02_SENIOR_BACKEND_DEV`**: Kommentiert Backend-Findings — sind sie realistisch behebbar? Aufwand?
- **`@03_SENIOR_FRONTEND_DEV`**: Kommentiert Frontend-Findings.
- **`@06_QA_TESTER`**: Welche Findings lassen sich durch Tests absichern?
- **`@04_PLATFORM_ENGINEER`**: DevOps/Deployment-Findings.

**Iterativ:** Auditor und Council diskutieren jedes Finding, bis sie sich auf eine Lösung (oder bewusstes Akzeptieren mit Begründung) einigen. Bei **kritischen Uneinigkeiten wird der User manuell gefragt**.

### Phase 5: Action Items
- Aus der Diskussion entsteht eine priorisierte Liste konkreter Maßnahmen.
- Jede Maßnahme bekommt: Verantwortliche Rolle, Aufwand (S/M/L), Priorität (🔴🟡🟢).
- Kritische 🔴-Items werden als Tasks in die nächste Iteration aufgenommen.

---
**Tipp für den User:** Um ein Audit zu starten, schreibe einfach:
`/audit` oder `"Bitte starte ein vollständiges Projekt-Audit."`

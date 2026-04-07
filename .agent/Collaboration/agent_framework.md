# 🤝 AI Agent Collaboration Framework
- **Status:** Active
- **Last Updated:** 2026-03-02
- **Category:** Spec

## Interaction Matrix

| Agent Rolle | Primärer Fokus | Reviewer |
|------------|----------------|----------|
| ARCHITECT | System Design & Major Changes | Mandatory Approval |
| BACKEND | Service Layer & API | ARCHITECT |
| FRONTEND | Components & UI | ARCHITECT |
| PLATFORM | VPS, Coolify, Docker, Caddy, Backups | ARCHITECT |
| DESIGNER | Antigravity UI, 3D CSS, GSAP | FRONTEND |
| E2E TESTER | Playwright, Visual Regression | FRONTEND / BACKEND |
| AI ENGINEER| Ollama Vision, Alchemy Prompts, Late API | BACKEND |
| PO | Feature Scope, WhatsApp Flows, Business Value | ARCHITECT |
| DOCUMENTER | Setup/Onboarding, ADRs, Memory, README | ARCHITECT / PO |

## Implicit Documentation Rule
**WICHTIG:** Am Ende jedes signifikanten Features, nach größeren Architekturentscheidungen oder nach erfolgreichem Abschluss eines `/warroom` Workflows, wird das System den **`@09_TECHNICAL_WRITER`** *automatisch und implizit* aufrufen.
Der Documenter aktualisiert dann eigenständig das `memory.md`, erstellt ADRs und passt Setup-Guides an, ohne dass der User diesen Schritt explizit anfordern muss. Dies sichert das lokale Projektgedächtnis ab.

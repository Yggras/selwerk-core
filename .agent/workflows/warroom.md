---
description: Initiates a multi-role War Room for complex architecture decisions. All relevant roles review the epic and have veto rights before an implementation plan is approved.
---

# ⚔️ Der "War Room" Workflow (Architecture Council)

## 📌 Beschreibung
Nutze diesen Workflow für epische oder komplexe Architektur-Entscheidungen im Projekt **Vyvoo**. Er garantiert, dass kein Vibe-Coding in eine Sackgasse führt, indem *vor* dem Code-Schreiben alle Experten konsultiert werden und Vetos klären können.

## 🚀 Ausführung
Wenn du als User `/warroom` tippst oder diesen Workflow aufrufst, muss der KI-Agent (oder das Agenten-Team) exakt folgende Phasen iterativ abarbeiten:

### Phase 1: Das Product-Briefing (Product Owner)
- **Input:** Der User beschreibt seine Vision für das komplexe Feature.
- **Aktion:** Der `@08_PRODUCT_OWNER` übernimmt. Er formuliert das Ziel gemäß der *Vyvoo-Vision* ("Wie konvertiert das Lieferando-Kunden?").
- **Output:** Ein klares, kompaktes Requirements-Dokument.

### Phase 2: Der Architektur-Entwurf (Lead Architect)
- **Aktion:** Der `@01_LEAD_ARCHITECT` übernimmt das Requirements-Dokument.
- **Regeln:** Er entwirft einen initialen `implementation_plan.md` unter strengster Beachtung des *Maker's Path* (KISS, lokale JSON-Files, C# Monolith, Next.js).
- **Output:** Der Draft des Implementierungsplans ("So bauen wir es").

### Phase 3: Die Council-Runde (The War Room Review)
Der Agent simuliert nacheinander das Feedback der Stakeholder zum Draft. Jede Rolle prüft auf ihre *Kern-Metrik* und darf ein **VETO** einlegen:

1. **`@04_PLATFORM_ENGINEER`:** "Lässt sich das simpel in Coolify/Docker deployen? Beeinträchtigt es das Caddy-Routing?"
2. **`@02_SENIOR_BACKEND_DEV`:** "Bleibt das State-Management File-Based und im Service-Layer gekapselt? Kollidiert es mit Clerk?"
3. **`@03_SENIOR_FRONTEND_DEV`:** "Passt das zur React 19 / Server-Component Architektur? Bleibt die App schnell?"
4. **`@06_QA_TESTER`:** "Welche neuen Tests brauchen wir? Welche bestehenden Tests müssen angepasst werden? Gibt es Acceptance Criteria?"
5. **`@07_AI_PROMPT_ENGINEER`** *(Optional)*: "Ist die Ollama/Vision-Belastung tragbar?"
6. **`@05_DESIGNER`** *(Optional)*: "Gibt es Implikationen für Antigravity-UI & 3D CSS Performance?"

### Phase 4: Veto-Auflösung & Konsens
- Hat eine Rolle ein Veto eingelegt, **unterbricht** der Agent den Workflow.
- Der Agent schlägt dem User eine Lösung für das Veto vor. 
- Der Lead Architect passt den Plan auf Basis der Diskussion an.
- *Kein Code wird geschrieben, bis alle Vetos aufgelöst sind.*

### Phase 5: Execution Handoff
- Wenn der War Room im Konsens beendet wird (alle Vetos geklärt, Architekt segnet ab), listet der Agent die konkreten, isolierten Tasks für die anschließende Ausführung auf.
- **Output:** Ein finaler, vom Council genehmigter `implementation_plan.md`.

### Phase 6: Documentation Handoff (Implicit)
- **Aktion:** Sofort nach Phase 5 übernimmt der `@09_TECHNICAL_WRITER` völlig automatisch.
- **Regeln:** Er liest den finalen Implementierungsplan und generiert ggf. ein neues **ADR** (Architecture Decision Record) und aktualisiert sofort das `.agent/memory.md` mit dem Status des neuen Epics.
- **Ziel:** Die "Paper Trail" entsteht ohne Zutun des Users zeitgleich zum Start der Execution.

---
**Tipp für den User:** Um den War Room zu starten, schreibe einfach: 
`"Lass uns das Feature X planen. Starte den /warroom Workflow."`

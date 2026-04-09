---
name: ADR-002-Magic-Sync-Theatre
description: Architectural Decisions regarding the Modul 2 Magic Sync Frontend Implementation.
---

# Architecture Decision Record (ADR): Modul 2 Magic Sync Theatre

## Context
Wir müssen Modul 2 ("Magic Sync & User Data") für den Prototyp implementieren. Eine vollständige Anbindung an Stripe und ein echter Background-Job (FastAPI `SyncJob`) wurden aus zeitlichen Gründen und zur Reduzierung der Komplexität vorerst gestrichen. Dennoch muss das Erlebnis der "Single Source of Truth" (SSOT) und die Visualisierung des Syncs (Premium Utility / Cinematic Command Center) simuliert werden.

## Decision

1. **Routing:** 
   Wir nutzen isolierte Next.js Routen (`/dashboard/profile` und `/dashboard/sync-center`), statt Overlays im Dashboard. Dies erlaubt komplexere Full-Screen GSAP Animationen, saubere State-Isolierung und natives Back-Button Verhalten.
2. **Datenfluss & Form-Handling:**
   Der Profil-Editor (`/dashboard/profile`) liest die Audit-Ergebnisse aus dem lokalen Zustand aus und zeigt sie in einer React Hook Form (SSOT Panel). Beim Submit (Speichern) werden die Daten *zuerst* global im Store persistiert, dann wird geroutet.
3. **Mock Sync Architektur ("Frontend Theatre"):**
   Der "Magic Sync" wird durch einen React Hook (`useMagicSync.ts`) simuliert. 
   - *Backend Readiness:* Um Technical Debt abzufangen, erzwingt ein striktes Interface (`ISyncStatus`), dass der Frontend-Mock genau den Daten-Payload zurückliefert, der in Zukunft von der echten FastAPI (`GET /api/sync/status`) zurückgegeben wird. 

## Consequences
- **Positive:** Extrem schnelle Geschwindigkeit der Prototyp-Fertigstellung (1 Tag statt 1 Woche). Das "Wow"-Gefühl bleibt durch Antigravity Design voll erhalten.
- **Negative:** Keine echten API Calls zu Stripe oder Insites/Google. Status des Syncs bleibt rein clientseitig "gemockt".

## Status
Approved von Lead Architect & Council (War Room). Umsetzung im Frontend gestartet.

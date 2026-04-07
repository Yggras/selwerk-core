---
trigger: always_on
---

# 📜 Architekturgesetze
- **Status:** Active
- **Last Updated:** 2026-03-02
- **Category:** Rule

Diese Gesetze gelten projektübergreifend für alle Rollen und Agents.

---

## Law #1: SERVICE LAYER PATTERN
API-Routen sind Transport-Layer.

- **Regel:** Keine Business-Logic im Controller.
- **Action:** Alle Business-Logic in Services auslagern.

---

## Law #2: TRAILING SLASH HYGIENE
Endpoints müssen resilient gegenüber Slashes sein.

- **Anforderung:** Sowohl `/api/path` als auch `/api/path/` unterstützen.

---

## Law #3: FILE I/O & ATOMIC WRITES
Nutze Dateibasierte Locks oder Semaphore statt DB-Transaktionen.

- **Regel:** Da wir Append-Only JSON-Dateien nutzen (keine SQL DBs mit ACID-Transaktionen), müssen Schreibzugriffe auf `config.json` oder `events.json` thread-safe und ggf. atomar ablaufen.

## Law #4: NO BLIND EDITS
Automatische Bulk-Code-Modifikationen sind ohne chirurgische Präzision verboten.

- **Regel:** Kein `sed`, `awk` oder `grep|xargs` für Code-Replacements ohne Zeilen-Verifikation.
- **Standard:** Jede Änderung via `git diff` prüfen.

---



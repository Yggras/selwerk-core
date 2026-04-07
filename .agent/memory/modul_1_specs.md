# Feature- & Designbeschreibung: Modul 1 (The Audit Motor)

## 1. Featurebeschreibung: Der Audit-Motor
Der Audit-Motor ist das „Eingangstor“ und der wichtigste Lead-Magnet der Applikation. Er verwandelt eine minimale Nutzereingabe in eine fundierte Analyse der digitalen Präsenz.

### Kernfunktionalitäten:
- **Lead-Eingabe:** Ein einziges, prominentes Suchfeld für URL oder Firmenname.
- **Asynchroner Scan:** Integration der **Insites API** (`/v1/report`).
- **Heuristik-Engine:** Parsing des Insites-JSON-Payloads nach der **Split-Strategie**:
    - **Sales-Report (Vorschau):** Hohe Sensibilität („Pedant“). Meldet auch kleinste Inkonsistenzen (GmbH-Zusatz fehlt, Tippfehler), um Handlungsdruck zu erzeugen.
    - **Produktiver Bericht (Registrierter User):** Fokus auf Impact („Pragmatiker“). Meldet nur kritische Fehler (falsche Telefonnummer, fehlender Map-Pin).
- **Status-Polling:** Backend-seitiges Checken des Scan-Status bei Insites.

---

## 2. Designbeschreibung: The Storyteller & Report UI
Das Design folgt der Philosophie **„Premium Utility“** – eine Mischung aus verlässlichem Werkzeug und moderner Tech-Eleganz.

### Die „Storyteller“-Wartephase (UX):
- **Cinematic Experience:** Statt eines einfachen Ladebalkens sieht der Nutzer eine dunkle, edle Lade-Animation mit pulsierenden Akzenten in „Digital Janitor Blue“.
- **Status-Karten:** Während der Scan läuft (ca. 60–120s), blenden wir animierte Karten ein, die den Fortschritt „erzählen“:
    - *„Prüfe Apple Maps auf Inkonsistenzen...“*
    - *„Scanne Google-Bewertungen...“*
- **Micro-Onboarding:** Die Karten vermitteln gleichzeitig Wissen (z.B. „80% der Kunden nutzen Google Maps zur Suche“), um die Wartezeit subjektiv zu verkürzen.

### Das Report-Layout (UI):
- **Binäre Visualisierung:** Fehler werden in einem satten, aber edlen Rot markiert; korrekte Daten in einem sanften Grün.
- **Klarheit vor Komplexität:** Keine Graphen. Nur Fakten-Karten: „Dein Name bei Google stimmt nicht mit Apple überein“.
- **Global Score:** Ein prominenter, animierter Score-Ring am Anfang des Berichts, der den „Zustand des Hauses“ visualisiert.
- **Call-to-Action:** Jede „Red Flag“ hat einen direkten Link zum „Magic Sync“ Modul (Modul 2), um den Fehler sofort zu beheben.

---

## Technischer Handoff (FastAPI & Next.js):
- **Next.js:** Nutzt `framer-motion` für die flüssigen Übergänge im Storyteller.
- **FastAPI:** Hält den State der `reportId` und exponiert einen `/audit/status/{id}` Endpoint.

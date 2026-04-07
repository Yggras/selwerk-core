# Antigravity Architecture Rule: Modern Fullstack Docker Orchestration

## 1. Tech Stack & Versioning
- **Frontend:**
    - **Framework:** Next.js 15+ (Stable).
    - **Architektur:** Erzwungene Nutzung des **App Router**.
    - **Sprache:** TypeScript im Strict Mode.
    - **Styling:** Tailwind CSS.
- **Backend:**
    - **Sprache:** Python 3.14+ (Stable).
    - **Framework:** FastAPI.
    - **Paketmanagement:** `pip` mit `requirements.txt`
- **Anweisung:** Der Agent muss bei jeder Generierung prüfen, ob die gewählten Library-Versionen mit diesen Mindeststandards kompatibel sind.

## 2. Docker & Security Standards
- **Base Images:** Verwende ausschließlich `-slim` oder `-alpine` Varianten (z. B. `python:3.12-slim` oder `node:20-alpine`).
- **Multi-Stage Builds:** Jedes Dockerfile muss eine `build`- und eine `runner`-Stage enthalten.
- **User Privileges:**
    - Erstelle in jedem Dockerfile einen Non-Root-User (z. B. `nextuser` oder `pythonuser`).
    - Der Container-Prozess darf **nicht** als `root` ausgeführt werden.
- **Consistency:** Erstelle für jedes Projekt eine `.dockerignore`, die mindestens `node_modules`, `.next`, `__pycache__`, `.env`, `.git` und `dist` ausschließt.

## 3. Networking & Service Discovery
- **Orchestrierung:** Eine zentrale `docker-compose.yml` im Root-Verzeichnis.
- **Service-Namen:**
    - Frontend Service: `frontend` (Port 3000)
    - Backend Service: `backend` (Port 8000)
- **Kommunikation:** - Das Frontend kommuniziert serverseitig über `http://backend:8000` mit der API.
    - Nutze Umgebungsvariablen (`NEXT_PUBLIC_API_URL` etc.) für alle Endpunkte.

## 4. Logging & Observability
- Alle Applikations-Logs müssen nach **STDOUT** und **STDERR** geleitet werden.
- Keine lokalen Log-Dateien innerhalb des Containers erstellen (Kompatibilität mit `docker logs`).

## 5. Agent Instructions (Behavioral Rules)
- **Validierung:** Bevor du Code schreibst, validiere die Verzeichnisstruktur gegen diese Docker-Vorgaben.
- **Auto-Config:** Wenn ein neuer Service oder eine neue Library hinzugefügt wird, aktualisiere sofort die entsprechende `requirements.txt`/`package.json` und das `Dockerfile`.
- **Environment:** Erstelle bei neuen Abhängigkeiten automatisch ein Update für die `.env.example`.
- **Restriktion:** Verweigere die Nutzung des veralteten Next.js "Pages Router" oder Python Versionen < 3.12.
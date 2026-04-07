---
trigger: always_on
---

# ALWAYS ON DOCKER – Localhost-Entwicklung

> **Gesetz 1**: Alle lokale Entwicklung läuft **ausschließlich** über Docker Container.
> Kein direktes `npm run dev`, `pnpm dev` oder `dotnet ..` auf dem Host-System.

> **Gesetz 2 (Educational DevOps)**: Alle Dockerfiles, `docker-compose.yml` Configs und komplexe Build-Scripte **MÜSSEN** extrem ausführlich und anfängerfreundlich auf Deutsch kommentiert werden. 
> Erkläre das "Warum" hinter jedem Schritt (z.B. Multi-Stage Builds, Port-Mappings), damit Docker-Anfänger das Setup sofort nachvollziehen können. Reiner Applikations-Code (C#, TypeScript) erfordert dies nicht.


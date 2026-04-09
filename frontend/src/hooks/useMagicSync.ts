import { useState, useEffect, useCallback, useRef } from "react";

// ──────────────────────────────────────────────
// ISyncStatus — the contract between Frontend Theatre
// and the future FastAPI GET /api/sync/status response.
// When we switch to real polling, ONLY the data source
// inside this hook changes; the interface stays identical.
// ──────────────────────────────────────────────
export interface ISyncStatus {
  status: "idle" | "progress" | "completed";
  progress: number;
  current_layer: string;
}

const SYNC_LAYERS: { at: number; label: string }[] = [
  { at: 0,  label: "Initialisiere SELLWERK Sync Engine v2.4…" },
  { at: 5,  label: "SSL-Handshake mit Google Business Profile…" },
  { at: 12, label: "Verifiziere Master-Daten Integrität…" },
  { at: 20, label: "Schreibe Stammdaten in Google Business…" },
  { at: 30, label: "Authentifiziere Apple Maps Connect API…" },
  { at: 38, label: "Apple Maps – Konfliktlösung läuft…" },
  { at: 45, label: "Facebook Business Suite – Seiten-Sync…" },
  { at: 55, label: "Instagram Business Profil aktualisieren…" },
  { at: 62, label: "Bing Places – Mutation gestartet…" },
  { at: 70, label: "Validiere Plattform-Responses…" },
  { at: 78, label: "Schreibe in 37 weitere Verzeichnisse…" },
  { at: 85, label: "Cross-Platform Konsistenz-Check…" },
  { at: 92, label: "Finalisiere AI Insights & Scoring…" },
  { at: 98, label: "Commit erfolgreich – Sync abgeschlossen." },
];

function getLayerForProgress(progress: number): string {
  let label = SYNC_LAYERS[0].label;
  for (const layer of SYNC_LAYERS) {
    if (progress >= layer.at) label = layer.label;
  }
  return label;
}

interface UseMagicSyncOptions {
  /** Duration of the full mock sync in milliseconds (default: 15000) */
  durationMs?: number;
  /** Callback fired once progress hits 100 */
  onComplete?: () => void;
}

export function useMagicSync(options: UseMagicSyncOptions = {}) {
  const { durationMs = 15000, onComplete } = options;

  const [syncStatus, setSyncStatus] = useState<ISyncStatus>({
    status: "idle",
    progress: 0,
    current_layer: "",
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startSync = useCallback(() => {
    cleanup();

    setSyncStatus({
      status: "progress",
      progress: 0,
      current_layer: SYNC_LAYERS[0].label,
    });

    const tickMs = 200;
    const increment = 100 / (durationMs / tickMs);
    let current = 0;

    intervalRef.current = setInterval(() => {
      current = Math.min(current + increment + Math.random() * 0.4, 100);
      const roundedProgress = Math.round(current);

      if (roundedProgress >= 100) {
        setSyncStatus({
          status: "completed",
          progress: 100,
          current_layer: "Commit erfolgreich – Sync abgeschlossen.",
        });
        cleanup();
        onCompleteRef.current?.();
      } else {
        setSyncStatus({
          status: "progress",
          progress: roundedProgress,
          current_layer: getLayerForProgress(roundedProgress),
        });
      }
    }, tickMs);
  }, [durationMs, cleanup]);

  // Cleanup on unmount (user hits back, navigates away, etc.)
  useEffect(() => cleanup, [cleanup]);

  return {
    syncStatus,
    startSync,
    /** Expose for log rendering in the Command Center */
    SYNC_LAYERS,
  };
}

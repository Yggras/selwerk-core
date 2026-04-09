"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Loader2,
  Globe,
  MapPin,
  Search,
  Smartphone,
  Share2,
  Server,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMagicSync } from "@/hooks/useMagicSync";
import { SellwerkLogo } from "@/components/brand/SellwerkLogo";

// ─── Platform tiles ──────────────────────────
interface PlatformTile {
  id: string;
  name: string;
  icon: React.ElementType;
  activateAt: number; // progress % when it starts "syncing"
  completeAt: number; // progress % when it finishes
}

const PLATFORMS: PlatformTile[] = [
  { id: "google", name: "Google Business", icon: MapPin, activateAt: 5, completeAt: 30 },
  { id: "apple", name: "Apple Maps", icon: Globe, activateAt: 25, completeAt: 50 },
  { id: "facebook", name: "Facebook Page", icon: Share2, activateAt: 40, completeAt: 60 },
  { id: "instagram", name: "Instagram Business", icon: Smartphone, activateAt: 50, completeAt: 72 },
  { id: "bing", name: "Bing Places", icon: Search, activateAt: 60, completeAt: 85 },
];

function getPlatformStatus(progress: number, p: PlatformTile) {
  if (progress >= p.completeAt) return "done";
  if (progress >= p.activateAt) return "active";
  return "waiting";
}

// ─── Page ────────────────────────────────────
export default function SyncCenterPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const lastLayerRef = useRef("");

  const { syncStatus, startSync } = useMagicSync({
    durationMs: 18000,
    onComplete: () => {
      // Auto-redirect after a short celebration delay
      setTimeout(() => router.push("/dashboard"), 3000);
    },
  });

  // Auto-start sync on mount
  useEffect(() => {
    startSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Append log entries as layers change
  useEffect(() => {
    if (
      syncStatus.current_layer &&
      syncStatus.current_layer !== lastLayerRef.current
    ) {
      lastLayerRef.current = syncStatus.current_layer;
      setLogs((prev) => [...prev, syncStatus.current_layer]);
    }
  }, [syncStatus.current_layer]);

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const isComplete = syncStatus.status === "completed";

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col font-sans relative overflow-hidden">
      {/* ── Ambient background glow ─────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      {/* ── Header ─────────────────────────── */}
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-white/5 relative z-10">
        <SellwerkLogo size="md" />
        <div className="flex items-center gap-3">
          {!isComplete && (
            <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-black animate-pulse uppercase tracking-widest">
              Live Sync Aktiv
            </span>
          )}
          {isComplete && (
            <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              ✓ Sync Abgeschlossen
            </span>
          )}
        </div>
      </nav>

      {/* ── Content ────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-start py-12 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-6xl space-y-10"
        >
          {/* ── Title ──────────────────────── */}
          <div className="text-center mb-4">
            <motion.h1
              className="text-5xl md:text-6xl font-display font-black text-white tracking-tighter leading-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isComplete ? "Synchronisation erfolgreich" : "Magic Sync"}
            </motion.h1>
            <motion.p
              className="text-white/40 font-medium text-lg mt-4 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {isComplete
                ? "Alle Plattformen sind auf dem neuesten Stand."
                : "Ihre Master-Daten werden jetzt auf alle Plattformen verteilt."}
            </motion.p>
          </div>

          {/* ── Platform Grid ──────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {PLATFORMS.map((platform, idx) => {
              const status = getPlatformStatus(syncStatus.progress, platform);
              const isDone = status === "done";
              const isActive = status === "active";

              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  className={`p-6 rounded-[2rem] border backdrop-blur-xl transition-all duration-700 flex flex-col items-center gap-4 ${
                    isDone
                      ? "bg-primary/10 border-primary/30 shadow-xl shadow-primary/10"
                      : isActive
                        ? "bg-white/5 border-primary/20"
                        : "bg-white/[0.03] border-white/5"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isDone
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : isActive
                          ? "bg-primary/80 text-white animate-pulse"
                          : "bg-white/5 text-white/20 border border-white/5"
                    }`}
                  >
                    {isDone ? (
                      <Check size={24} />
                    ) : isActive ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <platform.icon size={24} />
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-black text-white/80 block mb-1">
                      {platform.name}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-black tracking-[0.2em] ${
                        isDone
                          ? "text-primary"
                          : isActive
                            ? "text-primary/60"
                            : "text-white/20"
                      }`}
                    >
                      {isDone ? "Synchron" : isActive ? "Sync..." : "Warten"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Console + Status ────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Terminal Log */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2 bg-black/40 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/5 font-mono text-[11px] overflow-hidden h-[350px] flex flex-col relative"
            >
              {/* Decorative globe */}
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Globe size={120} className="text-primary" />
              </div>

              {/* Terminal bar */}
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="h-4 w-px bg-white/10 mx-2" />
                <Server size={14} className="text-primary" />
                <span className="text-primary font-bold uppercase tracking-widest text-[10px]">
                  Sync Engine Kernel Log
                </span>
              </div>

              {/* Scrollable log content */}
              <div className="flex-1 overflow-y-auto space-y-2.5 text-white/40 scrollbar-hide relative z-10">
                <AnimatePresence>
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-4"
                    >
                      <span className="text-white/20 shrink-0 tabular-nums">
                        [{new Date().toLocaleTimeString("de-DE")}]
                      </span>
                      <span
                        className={
                          log.includes("Commit")
                            ? "text-primary font-bold"
                            : log.includes("Schreibe")
                              ? "text-primary/80"
                              : log.includes("Konflikt")
                                ? "text-amber-400"
                                : ""
                        }
                      >
                        {log}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={logEndRef} />
              </div>
            </motion.div>

            {/* Status Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <span className="text-sm font-black text-white/60 uppercase tracking-widest">
                    Network Status
                  </span>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-white/30 uppercase tracking-widest">
                      Abdeckung
                    </span>
                    <span className="text-5xl font-display font-black text-white tracking-tighter">
                      {syncStatus.progress}%
                    </span>
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                    <motion.div
                      animate={{ width: `${syncStatus.progress}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 40,
                        damping: 15,
                      }}
                      className="h-full bg-primary rounded-full shadow-lg shadow-primary/30"
                    />
                  </div>
                </div>

                {/* Current task label */}
                <div className="min-h-[3rem]">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={syncStatus.current_layer}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-white/30 font-medium leading-relaxed"
                    >
                      {syncStatus.current_layer}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* CTA Button */}
              <AnimatePresence mode="wait">
                {isComplete ? (
                  <motion.button
                    key="done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm transition-all shadow-2xl bg-primary text-white shadow-primary/20 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95"
                  >
                    <ShieldCheck size={20} />
                    Zum Dashboard
                    <ArrowRight size={16} />
                  </motion.button>
                ) : (
                  <motion.div
                    key="syncing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm bg-white/5 text-white/30 flex items-center justify-center gap-3 border border-white/5 cursor-default"
                  >
                    <Loader2 size={18} className="animate-spin" />
                    Synchronisierung läuft…
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Completion overlay ──────────────── */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.2,
              }}
              className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40"
            >
              <ShieldCheck size={64} className="text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

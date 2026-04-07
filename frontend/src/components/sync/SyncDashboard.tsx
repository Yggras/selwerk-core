"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Globe, MapPin, Search, Server, Zap, Smartphone, Share2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  status: "pending" | "processing" | "success" | "ready";
}

const INITIAL_PLATFORMS: Platform[] = [
  { id: "google", name: "Google Business", icon: MapPin, status: "pending" },
  { id: "facebook", name: "Facebook Page", icon: Share2, status: "pending" },
  { id: "instagram", name: "Instagram Business", icon: Smartphone, status: "pending" },
  { id: "apple", name: "Apple Maps", icon: Globe, status: "pending" },
  { id: "bing", name: "Bing Places", icon: Search, status: "pending" },
];

interface SyncDashboardProps {
  progress: number;
  platformStatus: Record<string, string>;
  isPaid: boolean;
  onSimulatePayment: () => void;
}

export function SyncDashboard({ progress, platformStatus, isPaid, onSimulatePayment }: SyncDashboardProps) {
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Initialisiere Sync-Engine v1.0..."]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate technical logs based on progress and status
    if (progress > 10 && logs.length < 2) {
       setLogs(prev => [...prev, "[AUDIT] Verifiziere Master-Daten Integrität...", "[AUTH] Initialisiere API Handshakes..."]);
    }
    if (progress > 40 && logs.length < 4) {
       setLogs(prev => [...prev, "[WRITE] Google Business Profile Mutation gestartet...", "[STATUS] Warte auf Plattform Response..."]);
    }
    if (progress >= 90 && !isPaid && logs.length < 6) {
       setLogs(prev => [...prev, "[GATE] Schreibschutz aktiv: Zahlung erforderlich für finalen Commit.", "[SYSTEM] Sync steht bereit für Push..."]);
    }
  }, [progress, isPaid]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Platform Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {INITIAL_PLATFORMS.map((platform) => {
          const status = platformStatus[platform.name] || "pending";
          const isActive = progress > 0 && status !== "success";
          const isDone = status === "success" || (progress === 100 && isPaid);

          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl border transition-all duration-500 flex flex-col items-center gap-4 ${
                isDone ? "bg-green-50 border-green-100 shadow-lg shadow-green-500/5" : "bg-white border-slate-100"
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  isDone ? "bg-green-500 text-white" : isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
              }`}>
                {isDone ? <Check size={24} /> : isActive ? <Loader2 size={24} className="animate-spin" /> : <platform.icon size={24} />}
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-slate-800 block">{platform.name}</span>
                <span className={`text-[10px] uppercase font-black tracking-widest ${isDone ? "text-green-600" : "text-slate-300"}`}>
                    {isDone ? "Synced" : status === "ready" ? "Bereit" : "Warten"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Console & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Terminal Log */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[2rem] p-6 shadow-2xl border border-slate-800 font-mono text-xs overflow-hidden h-[300px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 opacity-50">
                <Server size={14} className="text-blue-400" />
                <span className="text-blue-400 uppercase tracking-tighter">Live System Kernel Log</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 text-slate-300 scrollbar-hide">
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-3">
                        <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <span className={log.includes("[WRITE]") ? "text-amber-400" : log.includes("[GATE]") ? "text-red-400" : ""}>{log}</span>
                    </div>
                ))}
                <div ref={logEndRef} />
            </div>
        </div>

        {/* Action / Paywall Trigger */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Zap size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-800">Sync Status</span>
                </div>
                
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-slate-400 uppercase">Globale Abdeckung</span>
                        <span className="text-3xl font-black text-slate-900">{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-blue-600 rounded-full"
                        />
                    </div>
                </div>

                {!isPaid && progress >= 90 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-700 leading-relaxed mb-6"
                    >
                        <strong>Fast geschafft!</strong> Alle Plattformen sind vorbereitet. Schalte jetzt die finale Synchronisierung frei.
                    </motion.div>
                )}
            </div>

            <button
                onClick={onSimulatePayment}
                disabled={isPaid}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isPaid 
                    ? "bg-green-500 text-white cursor-default" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 active:scale-95"
                }`}
            >
                {isPaid ? (
                    <>
                        <Check size={20} />
                        Sync Abgeschlossen
                    </>
                ) : (
                    <>
                        {progress >= 90 ? "Jetzt final freischalten" : "Sync vorbereiten..."}
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Globe, MapPin, Search, Server, Zap, Smartphone, Share2, ShieldCheck } from "lucide-react";
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
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Initialisiere SELLWERK Sync-Engine v2.4..."]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progress > 10 && logs.length < 2) {
       setLogs(prev => [...prev, "[AUDIT] Verifiziere Master-Daten Integrität...", "[AUTH] Initialisiere Secure SSL Handshakes..."]);
    }
    if (progress > 40 && logs.length < 4) {
       setLogs(prev => [...prev, "[WRITE] Global Business Directory Mutation gestartet...", "[STATUS] Warte auf Plattform Response..."]);
    }
    if (progress >= 90 && !isPaid && logs.length < 6) {
       setLogs(prev => [...prev, "[GATE] Schreibschutz aktiv: Validierung erforderlich für finalen Commit.", "[SYSTEM] Sync steht bereit für Push..."]);
    }
  }, [progress, isPaid, logs.length]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 font-sans">
      {/* Platform Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {INITIAL_PLATFORMS.map((platform) => {
          const status = platformStatus[platform.name] || "pending";
          const isActive = progress > 0 && status !== "success";
          const isDone = status === "success" || (progress === 100 && isPaid);

          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-8 rounded-[2rem] border transition-all duration-700 flex flex-col items-center gap-5 ${
                isDone ? "bg-primary/5 border-primary/20 shadow-xl shadow-primary/5" : "bg-white border-slate-100"
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isDone ? "bg-primary text-white shadow-lg shadow-primary/20" : isActive ? "bg-primary animate-pulse text-white" : "bg-slate-50 text-slate-300 border border-slate-100"
              }`}>
                {isDone ? <Check size={28} /> : isActive ? <Loader2 size={28} className="animate-spin" /> : <platform.icon size={28} />}
              </div>
              <div className="text-center">
                <span className="text-xs font-black text-slate-900 block mb-1">{platform.name}</span>
                <span className={`text-[10px] uppercase font-black tracking-[0.2em] ${isDone ? "text-primary" : "text-slate-300"}`}>
                    {isDone ? "Synchron" : status === "ready" ? "Bereit" : "Warten"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Console & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Terminal Log */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 font-mono text-[11px] overflow-hidden h-[350px] flex flex-col relative">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Globe size={120} className="text-primary" />
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="h-4 w-px bg-slate-700 mx-2" />
                <Server size={14} className="text-primary" />
                <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Sync Engine Kernel Log</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2.5 text-slate-400 scrollbar-hide relative z-10">
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-4">
                        <span className="text-slate-600 shrink-0 tabular-nums">[{new Date().toLocaleTimeString('de-DE')}]</span>
                        <span className={log.includes("[WRITE]") ? "text-primary" : log.includes("[GATE]") ? "text-amber-400 font-bold" : ""}>{log}</span>
                    </div>
                ))}
                <div ref={logEndRef} />
            </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Zap size={20} />
                    </div>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Network Status</span>
                </div>
                
                <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Abdeckung</span>
                        <span className="text-5xl font-display font-black text-slate-900 tracking-tighter">{progress}%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1">
                        <motion.div 
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 40, damping: 15 }}
                            className="h-full bg-primary rounded-full shadow-lg shadow-primary/20"
                        />
                    </div>
                </div>

                {!isPaid && progress >= 90 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800 leading-relaxed mb-8 font-medium"
                    >
                        <strong>Fast geschafft!</strong> Alle Vorbereitungen sind abgeschlossen. Starten Sie jetzt den finalen Push.
                    </motion.div>
                )}
            </div>

            <button
                onClick={onSimulatePayment}
                disabled={isPaid}
                className={`w-full py-6 rounded-[1.5rem] font-black uppercase tracking-widest text-sm transition-all shadow-2xl relative z-10 flex items-center justify-center gap-3 ${
                    isPaid 
                    ? "bg-primary text-white cursor-default shadow-primary/20" 
                    : "bg-slate-900 text-white hover:bg-primary shadow-slate-900/10 hover:shadow-primary/20 active:scale-95"
                }`}
            >
                {isPaid ? (
                    <>
                        <ShieldCheck size={20} />
                        Sync Abgeschlossen
                    </>
                ) : (
                    <>
                        {progress >= 90 ? "Finaler Push Starten" : "Engine Vorbereiten..."}
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}

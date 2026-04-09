"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Trophy, Mail, ArrowRight, Lock } from "lucide-react";
import { type AuditSummary, type RedFlag } from "@/hooks/useAudit";
import { useState } from "react";

interface AuditReportProps {
  data: AuditSummary;
  onUnlock: (email: string) => void;
  isGated?: boolean;
}

export function AuditReport({ data, onUnlock, isGated = true }: AuditReportProps) {
  const [email, setEmail] = useState("");

  const scoreColor = data.overall_score !== undefined
    ? data.overall_score > 70 ? "text-green-500" : data.overall_score > 40 ? "text-amber-500" : "text-red-500"
    : "text-slate-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto px-4 py-12"
    >
      {/* Header Section */}
      <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-blue-500/5 border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                <motion.circle 
                    cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={364.4}
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{ strokeDashoffset: 364.4 - (364.4 * (data.overall_score || 0)) / 100 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className={scoreColor}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{data.overall_score || "?"}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Score</span>
            </div>
        </div>

        <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                <Trophy size={14} />
                Audit Report Abgeschlossen
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Zustand deiner Präsenz</h1>
            <p className="text-slate-500 text-lg">
                Wir haben <span className="font-bold text-slate-800">{data.red_flags_count} kritische Punkte</span> gefunden, die deine Sichtbarkeit beeinträchtigen.
            </p>
        </div>
      </div>

      {/* Red Flags List */}
      <div className="space-y-4 relative">
        <h2 className="text-xl font-bold text-slate-800 px-2 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            Dringende Handlungsfelder
        </h2>
        
        {data.public_flags.map((flag, idx) => (
            <FlagCard key={idx} flag={flag} />
        ))}

        {/* Gated Content */}
        {isGated && (
            <div className="relative mt-8">
                {/* Blurry placeholders for visual tease */}
                <div className="space-y-4 blur-[6px] pointer-events-none opacity-40">
                    <div className="h-24 bg-slate-200 rounded-2xl w-full" />
                    <div className="h-24 bg-slate-200 rounded-2xl w-full" />
                </div>

                {/* Gating Card */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-md border border-blue-100 p-8 rounded-3xl shadow-xl max-w-md text-center">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30">
                            <Lock size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                          {data.red_flags_count > 2 
                            ? `Restliche ${data.red_flags_count - 2} Punkte freischalten` 
                            : "Vollständige Analyse freischalten"}
                        </h3>
                        <p className="text-slate-500 mb-6">Wir senden dir den vollständigen Bericht und die Korrektur-Vorschläge per E-Mail.</p>
                        
                        <div className="flex flex-col gap-3">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="email" 
                                    placeholder="Deine E-Mail Adresse"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button 
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
                                onClick={() => onUnlock(email)}
                            >
                                Jetzt Report freischalten
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                            Mit dem Absenden akzeptierst du unsere Datenschutzbestimmungen. Kein Spam, nur dein Audit.
                        </p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </motion.div>
  );
}

function FlagCard({ flag }: { flag: RedFlag }) {
    const severityColor = flag.severity === "high" ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100";
    const iconColor = flag.severity === "high" ? "text-red-500" : "text-amber-500";
    
    return (
        <div className={`p-6 rounded-2xl border ${severityColor} flex gap-4 transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-slate-200/50`}>
            <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 ${iconColor}`}>
                <AlertCircle size={24} />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{flag.platform || "System"}</span>
                    <span className={`w-1 h-1 rounded-full bg-slate-300`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${iconColor}`}>{flag.severity} Impact</span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-1">{flag.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{flag.description}</p>
            </div>
        </div>
    );
}

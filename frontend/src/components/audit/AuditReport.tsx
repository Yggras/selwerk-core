"use client";

import { motion } from "framer-motion";
import { AlertCircle, Trophy, Mail, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { type AuditSummary, type RedFlag } from "@/hooks/useAudit";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface AuditReportProps {
  data: AuditSummary;
  onUnlock: (email: string) => void;
  isGated?: boolean;
}

export function AuditReport({ data, onUnlock, isGated = true }: AuditReportProps) {
  const [email, setEmail] = useState("");
  const flagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flagsRef.current && data.public_flags.length > 0) {
        gsap.fromTo(
           flagsRef.current.children,
           { opacity: 0, z: -100, y: 50, scale: 0.9 },
           { opacity: 1, z: 0, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }
        );
    }
  }, [data.public_flags]);

  const scoreColor = data.overall_score !== undefined
    ? data.overall_score > 70 ? "text-primary" : data.overall_score > 40 ? "text-amber-500" : "text-red-500"
    : "text-slate-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto px-6 py-12 font-sans"
    >
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-white/60 mb-10 flex flex-col md:flex-row items-center gap-10" style={{ perspective: 1000 }}>
        <motion.div 
            className="relative w-36 h-36 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-xl border border-white/60 shadow-xl"
            whileHover={{ rotateX: 15, rotateY: 15, scale: 1.05, z: 50 }}
            style={{ transformStyle: "preserve-3d" }}
        >
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="66" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                <motion.circle 
                    cx="72" cy="72" r="66" stroke="currentColor" strokeWidth="10" fill="transparent" 
                    strokeDasharray={414.7}
                    initial={{ strokeDashoffset: 414.7 }}
                    animate={{ strokeDashoffset: 414.7 - (414.7 * (data.overall_score || 0)) / 100 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className={scoreColor}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: "translateZ(30px)" }}>
                <span className="text-4xl font-display font-black text-slate-900 leading-none">{data.overall_score || "?"}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Score</span>
            </div>
        </motion.div>

        <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-5">
                <Trophy size={14} />
                Präsenz-Analyse Abgeschlossen
            </div>
            <h1 className="text-4xl font-display font-black text-slate-900 mb-3 tracking-tight">Status Ihrer Präsenz</h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
                Wir haben <span className="font-black text-slate-900">{data.red_flags_count} kritische Handlungsfelder</span> identifiziert, die Ihre regionale Sichtbarkeit einschränken.
            </p>
        </div>
      </div>

      {/* Red Flags List */}
      <div className="space-y-5 relative">
        <h2 className="text-2xl font-display font-black text-slate-900 px-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={24} />
            Dringende Handlungsfelder
        </h2>
        
        <div ref={flagsRef} className="space-y-5" style={{ perspective: 1000 }}>
            {data.public_flags.map((flag, idx) => (
                <FlagCard key={idx} flag={flag} />
            ))}
        </div>

        {/* Gated Content */}
        {isGated && (
            <div className="relative mt-12">
                <div className="space-y-5 blur-[8px] pointer-events-none opacity-30 select-none">
                    <div className="h-28 bg-slate-100 rounded-[2rem] w-full" />
                    <div className="h-28 bg-slate-100 rounded-[2rem] w-full" />
                </div>

                {/* Gating Card */}
                <div className="absolute inset-0 flex items-center justify-center -top-6">
                    <div className="bg-white/40 border border-white/50 p-10 rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] max-w-lg text-center backdrop-blur-2xl">
                        <div className="w-20 h-20 bg-primary/90 backdrop-blur-xl text-white rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-xl shadow-primary/20">
                            <Lock size={32} />
                        </div>
                        <h3 className="text-2xl font-display font-black text-slate-900 mb-3 tracking-tight">
                          {data.red_flags_count > 2 
                            ? `Restliche ${data.red_flags_count - 2} Handlungsfelder freischalten` 
                            : "Vollständige Analyse freischalten"}
                        </h3>
                        <p className="text-slate-500 font-medium mb-8 leading-relaxed">Erhalten Sie den detaillierten Bericht direkt in Ihr Postfach.</p>
                        
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input 
                                    type="email" 
                                    placeholder="Ihre Geschäfts-E-Mail"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-800"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button 
                                className="w-full bg-primary text-white font-bold py-5 rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group text-lg"
                                onClick={() => onUnlock(email)}
                            >
                                Report jetzt freischalten
                                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-6 leading-relaxed font-bold uppercase tracking-widest">
                          <CheckCircle2 size={10} className="inline mr-1" /> SELLWERK Privacy Standards
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
    const severityColor = flag.severity === "high" ? "bg-red-50/50 border-red-100" : "bg-amber-50/50 border-amber-100";
    const iconColor = flag.severity === "high" ? "text-red-500" : "text-amber-500";
    
    return (
        <div className={`p-8 rounded-[2rem] border ${severityColor} flex gap-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1 group bg-white/50 backdrop-blur-sm`}>
            <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 ${iconColor} group-hover:scale-110 transition-transform`}>
                <AlertCircle size={28} />
            </div>
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">{flag.platform || "System"}</span>
                    <span className={`w-1 h-1 rounded-full bg-slate-300`} />
                    <span className={`text-[11px] font-black uppercase tracking-[0.1em] ${iconColor}`}>{flag.severity} Impact</span>
                </div>
                <h4 className="font-display font-black text-slate-900 text-xl mb-1 tracking-tight">{flag.title}</h4>
                <p className="text-slate-600 font-medium leading-relaxed">{flag.description}</p>
            </div>
        </div>
    );
}

"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Globe, Gauge, Shield, FileCode, Smartphone, Monitor, ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SellwerkLogo } from "@/components/brand/SellwerkLogo";
import { StrategyBridge } from "@/components/dashboard/StrategyBridge";

function EditorContent() {
  const router = useRouter();

  const healthChecks = [
    { label: "Mobile PageSpeed", value: "8.2s", target: "< 2.5s", status: "critical", icon: Smartphone },
    { label: "Desktop PageSpeed", value: "3.1s", target: "< 1.5s", status: "warning", icon: Monitor },
    { label: "DSGVO Cookie-Banner", value: "Fehlt", target: "Konform", status: "critical", icon: Shield },
    { label: "SSL-Zertifikat", value: "Gültig", target: "Gültig", status: "ok", icon: CheckCircle2 },
    { label: "Kontaktformular", value: "Fehlerhaft", target: "Funktional", status: "critical", icon: FileCode },
    { label: "Mobile Responsive", value: "Teilweise", target: "Vollständig", status: "warning", icon: Smartphone },
  ];

  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    critical: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
    warning: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
    ok: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  };

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <StrategyBridge />

      {/* Header */}
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => router.push("/dashboard")}>
          <SellwerkLogo size="md" />
        </div>
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Zurück zum Dashboard
        </button>
      </nav>

      <div className="flex-1 py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl mx-auto"
        >
          {/* Hero */}
          <div className="bg-purple-600 rounded-[2.5rem] px-10 py-12 text-white relative overflow-hidden mb-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Globe size={22} />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.2em] opacity-90">Web-Integrität</span>
              </div>
              <h1 className="text-4xl font-display font-black tracking-tight">Website Editor</h1>
              <p className="text-white/80 mt-3 text-lg font-medium max-w-xl">
                Performance optimieren, DSGVO-Konformität sicherstellen und Ihr digitales Schaufenster perfektionieren.
              </p>
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 mb-10 flex items-center gap-8">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="42" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <motion.circle
                  cx="48" cy="48" r="42"
                  stroke="#8B5CF6"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={263.9}
                  initial={{ strokeDashoffset: 263.9 }}
                  animate={{ strokeDashoffset: 263.9 - (263.9 * 22) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-display font-black text-purple-600">22</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-display font-black text-slate-900">Web-Integrität Score</h3>
              <p className="text-slate-500 font-medium mt-1">3 kritische Probleme erfordern sofortige Aufmerksamkeit.</p>
            </div>
            <div className="ml-auto flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl">
              <AlertTriangle size={16} />
              <span className="text-sm font-bold">3 Kritisch</span>
            </div>
          </div>

          {/* Health Checks Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {healthChecks.map((check) => {
              const config = statusConfig[check.status];
              return (
                <div key={check.label} className={`${config.bg} border border-slate-100 rounded-[2rem] p-8 hover:shadow-lg transition-all duration-500 group`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <check.icon size={20} className={config.text} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display font-black text-slate-900">{check.label}</h4>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${config.dot} animate-pulse`} />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Aktuell</span>
                      <span className={`text-lg font-bold ${config.text}`}>{check.value}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ziel</span>
                      <span className="text-lg font-bold text-slate-900">{check.target}</span>
                    </div>
                  </div>
                  {check.status !== "ok" && (
                    <button className="w-full mt-6 bg-white text-slate-900 py-3 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all border border-slate-100 shadow-sm">
                      Jetzt beheben
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function EditorPage() {
  return (
    <Suspense>
      <EditorContent />
    </Suspense>
  );
}

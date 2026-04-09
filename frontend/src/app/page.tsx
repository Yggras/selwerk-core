"use client";

import { useState, useEffect } from "react";
import { SearchInput } from "@/components/audit/SearchInput";
import { StorytellerLoader } from "@/components/audit/StorytellerLoader";
import { AuditReport } from "@/components/audit/AuditReport";
import { ProfileEditor } from "@/components/sync/ProfileEditor";
import { SyncDashboard } from "@/components/sync/SyncDashboard";
import { useAudit } from "@/hooks/useAudit";
import { useSync } from "@/hooks/useSync";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, LogOut, User as UserIcon, Mail } from "lucide-react";
import { DigiScoreGauge } from "@/components/dashboard/DigiScoreGauge";
import { GrowthFeed } from "@/components/dashboard/GrowthFeed";
export default function Home() {
  const { triggerAudit, isTriggering, auditData, isStorytellerActive } = useAudit();
  const { 
    profile, updateProfile, triggerSync, syncData, isPaid, simulatePayment,
    isAuthenticated, login, isLoggingIn, recommendations, completeRecommendation, logout, userEmail: activeEmail
  } = useSync();

  const [view, setView] = useState<"initial" | "scanning" | "report" | "editor" | "sync" | "dashboard" | "login">("initial");
  const [userEmail, setUserEmail] = useState("");

  // Handle Transitions
  useEffect(() => {
    if (isTriggering || isStorytellerActive || (auditData && auditData.status !== "complete")) {
      setView("scanning");
    } else if (auditData && auditData.status === "complete" && !isStorytellerActive && view === "scanning") {
      setView("report");
    }
  }, [isTriggering, isStorytellerActive, auditData, view]);

  // Auto-redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && view === "initial") {
        setView("dashboard");
    }
  }, [isAuthenticated, view]);

  const handleStartEditing = (email: string) => {
    setUserEmail(email);
    setView("editor");
  };

  const handleStartSync = (data: any) => {
    updateProfile(data, {
      onSuccess: (p: any) => {
        triggerSync({ profile_id: p.id, email: userEmail });
        setView("sync");
      }
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    if (email) {
        login(email, {
            onSuccess: () => setView("dashboard")
        });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <nav className="w-full px-6 py-6 flex justify-between items-center border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">
            Digital<span className="text-blue-600">Janitor</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Wie es funktioniert</a>
            {view === "sync" && <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Live Sync Active</span>}
            {isAuthenticated ? (
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-xs font-black text-slate-800 tracking-tight">{activeEmail}</span>
                        <span className="text-[10px] text-green-500 font-bold uppercase">Pro Janitor</span>
                    </div>
                    <button 
                        onClick={() => { logout(); setView("initial"); }}
                        className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => setView("login")}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all font-bold flex items-center gap-2"
                >
                    <UserIcon size={16} />
                    Login
                </button>
            )}
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center py-12 px-6">
        <AnimatePresence mode="wait">
          {view === "initial" && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-8 animate-bounce">
                <Sparkles size={16} />
                Neu: Deep Scan Heuristik v1.0
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                Dein digitaler Hausmeister <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">schafft Ordnung.</span>
              </h1>
              <p className="text-slate-500 text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed">
                Wir scannen deine Online-Präsenz auf über 40 Plattformen und finden Fehler, die dich Kunden kosten. Kostenlos. Sofort.
              </p>

              <SearchInput 
                onSearch={(url) => triggerAudit({ url })} 
                isLoading={isTriggering} 
              />

              <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                <span className="font-bold text-slate-400 flex items-center gap-2"><ShieldCheck size={18} /> Google Maps Certified</span>
                <span className="font-bold text-slate-400 flex items-center gap-2"><ShieldCheck size={18} /> API First Architecture</span>
                <span className="font-bold text-slate-400 flex items-center gap-2"><ShieldCheck size={18} /> GDPR Compliant</span>
              </div>
            </motion.div>
          )}

          {view === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <StorytellerLoader progress={auditData?.progress || 10} />
            </motion.div>
          )}

          {view === "report" && auditData && (
            <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <AuditReport data={auditData} onUnlock={handleStartEditing} />
            </motion.div>
          )}

          {view === "editor" && (
              <motion.div key="editor" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full">
                  <ProfileEditor 
                    initialData={{
                        business_name: profile?.business_name || auditData?.detected_data?.detected_name,
                        address: profile?.address || auditData?.detected_data?.detected_address,
                        phone: profile?.phone || auditData?.detected_data?.detected_phone,
                    }}
                    onSave={handleStartSync}
                  />
              </motion.div>
          )}

          {view === "sync" && (
              <motion.div key="sync" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
                  <SyncDashboard 
                    progress={syncData?.progress || 0}
                    platformStatus={syncData?.platform_status || {}}
                    isPaid={isPaid}
                    onSimulatePayment={simulatePayment}
                  />
              </motion.div>
          )}

          {view === "login" && (
              <motion.div key="login" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                  <div className="bg-white border border-slate-100 p-10 rounded-3xl shadow-2xl shadow-blue-600/10 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2">Willkommen zurück</h2>
                    <p className="text-slate-500 mb-8">Gib deine E-Mail ein, um zu deinem Dashboard zu gelangen.</p>
                    
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <input 
                            name="email"
                            type="email" 
                            placeholder="mail@dein-business.de"
                            required
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all text-lg"
                        />
                        <button 
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                            {isLoggingIn ? "Meldel dich an..." : "Dashboard öffnen"}
                        </button>
                    </form>
                    <button onClick={() => setView("initial")} className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                        Zurück zur Startseite
                    </button>
                  </div>
              </motion.div>
          )}

          {view === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl">
                  <div className="grid md:grid-cols-12 gap-8">
                    {/* Sidebar / Stats */}
                    <div className="md:col-span-4 space-y-8">
                        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm text-center relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
                           <DigiScoreGauge score={profile?.digi_score || 0} />
                           <div className="mt-6">
                                <h4 className="text-xl font-black text-slate-800">Profil Status</h4>
                                <p className="text-sm text-slate-400 mt-1">
                                    {profile?.digi_score < 80 ? "Da geht noch was! Erledige heute ein Task." : "Exzellent! Dein Profil ist in Top-Form."}
                                </p>
                           </div>
                        </div>

                        <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
                            <Zap className="absolute top-4 right-4 text-blue-500 opacity-20" size={48} />
                            <h4 className="font-bold text-lg mb-2">Janitor Pro</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Dein digitaler Hausmeister überwacht 42 Plattformen in Echtzeit.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-400">
                                <ShieldCheck size={14} /> System-Status: Optimal
                            </div>
                        </div>
                    </div>

                    {/* Main Content / Feed */}
                    <div className="md:col-span-8">
                        <GrowthFeed 
                            recommendations={recommendations} 
                            onComplete={completeRecommendation}
                            isLoading={false}
                        />
                    </div>
                  </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-slate-400 text-xs border-t border-slate-100 bg-white">
        © 2024 Digital Janitor Labs • All rights reserved. • "Put your business on Autopilot."
      </footer>
    </main>
  );
}

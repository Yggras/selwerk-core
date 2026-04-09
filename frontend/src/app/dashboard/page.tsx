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
import { Sparkles, ShieldCheck, Zap, LogOut } from "lucide-react";
import { DigiScoreGauge } from "@/components/dashboard/DigiScoreGauge";
import { GrowthFeed } from "@/components/dashboard/GrowthFeed";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { triggerAudit, isTriggering, auditData, isStorytellerActive } = useAudit();
  const { 
    profile, updateProfile, triggerSync, syncData, isPaid, simulatePayment,
    isAuthenticated, logout, userEmail: activeEmail, recommendations, completeRecommendation,
    ingestAudit, isIngesting
  } = useSync();

  const [view, setView] = useState<"initial" | "scanning" | "ingesting" | "report" | "editor" | "sync" | "dashboard">("dashboard");
  const [userEmail, setUserEmail] = useState("");

  // Auto-Scan Logic: The "Hook" Bridge
  useEffect(() => {
    const pendingUrl = sessionStorage.getItem("pending_url");
    if (pendingUrl && isAuthenticated) {
      triggerAudit({ url: pendingUrl });
      sessionStorage.removeItem("pending_url");
      setView("scanning");
    }
  }, [isAuthenticated, triggerAudit]);

  // Handle Transitions based on Audit state
  useEffect(() => {
    if (isTriggering || isStorytellerActive || (auditData && auditData.status !== "complete")) {
      setView("scanning");
    } else if (auditData && auditData.status === "complete" && !isStorytellerActive && view === "scanning") {
        // Option A: Feed Injection instead of Report View
        const performIngest = async () => {
            setView("ingesting");
            try {
                await ingestAudit({ report_id: auditData.report_id, email: activeEmail || "" });
                // Small delay for UX "Aha" moment
                setTimeout(() => setView("dashboard"), 1500);
            } catch (err) {
                console.error("Ingestion failed", err);
                setView("dashboard");
            }
        };
        performIngest();
    }
  }, [isTriggering, isStorytellerActive, auditData, view, ingestAudit, activeEmail]);

  // Protected route check (redundant to middleware but good for UX)
  useEffect(() => {
    if (!isAuthenticated) {
        // We'll let middleware handle the hard redirect, 
        // but this ensures we don't show empty state if someone hangs around
    }
  }, [isAuthenticated, router]);

  const handleStartEditing = (email: string) => {
    setUserEmail(email);
    setView("editor");
  };

  const handleStartSync = (data: any) => {
    updateProfile(data, {
      onSuccess: (p: any) => {
        triggerSync({ profile_id: p.id, email: userEmail || activeEmail || "" });
        setView("sync");
      }
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <nav className="w-full px-6 py-6 flex justify-between items-center border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">
            Digital<span className="text-blue-600">Janitor</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            {view === "sync" && <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Live Sync Active</span>}
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-xs font-black text-slate-800 tracking-tight">{activeEmail}</span>
                    <span className="text-[10px] text-green-500 font-bold uppercase">Pro Janitor</span>
                </div>
                <button 
                    onClick={() => { logout(); router.push("/"); }}
                    className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center py-12 px-6">
        <AnimatePresence mode="wait">
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

          {view === "ingesting" && (
              <motion.div 
                key="ingesting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-12 bg-white rounded-[3rem] shadow-xl border border-blue-50 max-w-lg mx-auto"
              >
                  <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-lg shadow-blue-600/30">
                      <Sparkles className="text-white animate-pulse" size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Ergebnisse werden eingespielt...</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                      Wir wandeln deine Scan-Ergebnisse gerade in direkt umsetzbare Wachstums-Tasks um.
                  </p>
                  <div className="mt-8 flex justify-center gap-1">
                      {[0, 1, 2].map(i => (
                          <motion.div 
                            key={i}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                            className="w-2 h-2 bg-blue-600 rounded-full"
                          />
                      ))}
                  </div>
              </motion.div>
          )}

          {view === "report" && auditData && (
            <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <AuditReport data={auditData} onUnlock={handleStartEditing} isGated={false} />
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

          {view === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl">
                  {/* Dashboard Header with Search Option */}
                  <div className="flex justify-between items-end mb-12">
                      <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Übersicht</h2>
                        <p className="text-slate-500 font-medium">Willkommen in deinem Kontrollzentrum.</p>
                      </div>
                      <div className="w-96">
                        <SearchInput 
                            onSearch={(url) => triggerAudit({ url })} 
                            isLoading={isTriggering} 
                            placeholder="Neue Seite prüfen..."
                        />
                      </div>
                  </div>

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

      <footer className="w-full py-8 text-center text-slate-400 text-xs border-t border-slate-100 bg-white">
        © 2024 Digital Janitor Labs • All rights reserved. • "Put your business on Autopilot."
      </footer>
    </main>
  );
}

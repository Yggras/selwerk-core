"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Share2, MessageCircle, Camera, Briefcase, Calendar, TrendingUp, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SellwerkLogo } from "@/components/brand/SellwerkLogo";
import { StrategyBridge } from "@/components/dashboard/StrategyBridge";

function SocialContent() {
  const router = useRouter();

  const platforms = [
    { name: "Facebook", icon: MessageCircle, status: "Namenskonflikt", statusColor: "text-amber-600", bg: "bg-blue-50", connected: true, followers: "234" },
    { name: "Instagram", icon: Camera, status: "60+ Tage inaktiv", statusColor: "text-red-600", bg: "bg-pink-50", connected: true, followers: "89" },
    { name: "LinkedIn", icon: Briefcase, status: "Nicht beansprucht", statusColor: "text-slate-400", bg: "bg-sky-50", connected: false, followers: "—" },
  ];

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
          <div className="bg-blue-500 rounded-[2.5rem] px-10 py-12 text-white relative overflow-hidden mb-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Share2 size={22} />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.2em] opacity-90">Digitale Reichweite</span>
              </div>
              <h1 className="text-4xl font-display font-black tracking-tight">Social Media Management</h1>
              <p className="text-white/80 mt-3 text-lg font-medium max-w-xl">
                Profile synchronisieren, Beiträge planen und Ihre Reichweite im regionalen Umfeld ausbauen.
              </p>
            </div>
          </div>

          {/* Platform Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {platforms.map((p) => (
              <div key={p.name} className={`${p.bg} border border-slate-100 rounded-[2rem] p-8 hover:shadow-xl transition-all duration-500 group`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <p.icon size={24} className="text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-slate-900">{p.name}</h3>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${p.statusColor}`}>{p.status}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Follower</span>
                    <span className="font-bold text-slate-900">{p.followers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Verbunden</span>
                    <span className={`font-bold ${p.connected ? 'text-primary' : 'text-slate-400'}`}>{p.connected ? 'Ja' : 'Nein'}</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-white text-slate-900 py-3 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all border border-slate-100">
                  {p.connected ? 'Profil bearbeiten' : 'Jetzt verbinden'}
                </button>
              </div>
            ))}
          </div>

          {/* Content Planner placeholder */}
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="text-blue-500" size={32} />
            </div>
            <h3 className="text-2xl font-display font-black text-slate-900 mb-3">Content-Planer</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-6">
              Planen Sie Beiträge voraus und veröffentlichen Sie konsistent auf allen Plattformen gleichzeitig.
            </p>
            <button className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all">
              Beitrag erstellen
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function SocialPage() {
  return (
    <Suspense>
      <SocialContent />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, TrendingUp, BarChart3, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SellwerkLogo } from "@/components/brand/SellwerkLogo";
import { StrategyBridge } from "@/components/dashboard/StrategyBridge";

function ReputationContent() {
  const router = useRouter();

  const mockReviews = [
    { platform: "Google", rating: 1, author: "M. Schmidt", text: "Lange Wartezeit, unfreundlicher Service. Komme nicht wieder.", date: "vor 3 Tagen", replied: false },
    { platform: "Google", rating: 5, author: "A. Wagner", text: "Beste Bäckerei in der Stadt! Die Brötchen sind fantastisch.", date: "vor 1 Woche", replied: true },
    { platform: "Yelp", rating: 3, author: "T. Fischer", text: "Ganz okay, aber nichts Besonderes. Preise sind etwas hoch.", date: "vor 2 Wochen", replied: false },
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
          <div className="bg-amber-500 rounded-[2.5rem] px-10 py-12 text-white relative overflow-hidden mb-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Star size={22} />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.2em] opacity-90">Kunden-Stimmen</span>
              </div>
              <h1 className="text-4xl font-display font-black tracking-tight">Reputation Management</h1>
              <p className="text-white/80 mt-3 text-lg font-medium max-w-xl">
                Bewertungen überwachen, professionell antworten und Vertrauen aufbauen — alles an einem Ort.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { icon: Star, label: "Durchschnitt", value: "3.7", sub: "von 5.0" },
              { icon: MessageSquare, label: "Unbeantwortete", value: "4", sub: "Bewertungen" },
              { icon: TrendingUp, label: "Trend", value: "-0.3", sub: "letzte 30 Tage" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-100 rounded-[2rem] p-8 text-center hover:shadow-xl transition-all duration-500">
                <stat.icon className="mx-auto text-amber-500 mb-3" size={28} />
                <span className="text-3xl font-display font-black text-slate-900">{stat.value}</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div className="space-y-5">
            <h3 className="text-xl font-display font-black text-slate-900 flex items-center gap-3 px-2">
              <BarChart3 className="text-amber-500" size={22} />
              Aktuelle Bewertungen
            </h3>
            {mockReviews.map((review, idx) => (
              <div key={idx} className={`bg-white border rounded-[2rem] p-8 transition-all hover:shadow-lg ${!review.replied ? 'border-amber-200 bg-amber-50/20' : 'border-slate-100'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={16} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{review.platform}</span>
                  <span className="text-xs text-slate-300">{review.date}</span>
                  {!review.replied && (
                    <span className="ml-auto text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100 uppercase tracking-wider">Antwort ausstehend</span>
                  )}
                </div>
                <p className="text-slate-700 font-medium leading-relaxed mb-2">"{review.text}"</p>
                <span className="text-xs font-bold text-slate-400">— {review.author}</span>
                {!review.replied && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary transition-all">
                      Professionell antworten
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function ReputationPage() {
  return (
    <Suspense>
      <ReputationContent />
    </Suspense>
  );
}

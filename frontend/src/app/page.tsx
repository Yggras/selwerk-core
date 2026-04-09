"use client";

import { SearchInput } from "@/components/audit/SearchInput";
import { useAudit } from "@/hooks/useAudit";
import { motion } from "framer-motion";
import { ShieldCheck, Globe, ArrowUpCircle, User as UserIcon, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SellwerkLogo } from "@/components/brand/SellwerkLogo";

export default function LandingPage() {
  const router = useRouter();
  const { isTriggering } = useAudit();

  const handleSearch = (url: string) => {
    sessionStorage.setItem("pending_url", url);
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-50">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity" 
          onClick={() => window.location.reload()}
        >
          <SellwerkLogo size="md" />
        </div>
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            <a href="#" className="hover:text-primary transition-colors">Lösungen</a>
            <a href="#" className="hover:text-primary transition-colors">Über uns</a>
            <button 
                onClick={() => router.push("/login")}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-bold flex items-center gap-2"
            >
                <UserIcon size={16} />
                Kunden-Login
            </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 bg-linear-to-b from-secondary/10 to-transparent">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl text-center"
        >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-10">
              <CheckCircle2 size={16} />
              Offizieller SELLWERK Digital Check
            </div>
            
            <h1 className="text-5xl md:text-8xl font-display font-black text-slate-900 mb-8 tracking-tighter leading-[0.95]">
              Ihr digitaler Erfolg <br />
              <span className="text-primary italic">im Mittelstand.</span>
            </h1>
            
            <p className="text-slate-500 text-xl md:text-2xl max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
              Wir optimieren Ihre Online-Präsenz auf über 40 Plattformen und finden ungenutzte Potenziale. <span className="text-slate-900 font-bold">Kostenlos. Sofort. Professionell.</span>
            </p>

            <div className="w-full max-w-3xl mx-auto mb-20">
                <SearchInput 
                    onSearch={handleSearch} 
                    isLoading={isTriggering} 
                />
            </div>

            <div className="flex flex-wrap justify-center gap-12 text-slate-400">
              <div className="flex items-center gap-3 group">
                <ShieldCheck size={24} className="group-hover:text-primary transition-colors" />
                <span className="font-bold text-sm tracking-wide uppercase">Google Partner</span>
              </div>
              <div className="flex items-center gap-3 group">
                <Globe size={24} className="group-hover:text-primary transition-colors" />
                <span className="font-bold text-sm tracking-wide uppercase">Multi-Platform Sync</span>
              </div>
              <div className="flex items-center gap-3 group">
                <ArrowUpCircle size={24} className="group-hover:text-primary transition-colors" />
                <span className="font-bold text-sm tracking-wide uppercase">Mittelstand Fokus</span>
              </div>
            </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 text-center text-slate-500 text-sm border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="opacity-50 grayscale">
            <SellwerkLogo size="sm" showTagline={false} />
          </div>
          <div className="flex gap-8 font-medium">
            <a href="#" className="hover:text-primary transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-primary transition-colors">Impressum</a>
            <a href="#" className="hover:text-primary transition-colors">Kontakt</a>
          </div>
          <p>© 2024 SELLWERK • Partner für den Mittelstand.</p>
        </div>
      </footer>
    </main>
  );
}

"use client";

import { useSync } from "@/hooks/useSync";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { SellwerkLogo } from "@/components/brand/SellwerkLogo";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn, isAuthenticated } = useSync();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
        login(email, {
            onSuccess: () => router.push("/dashboard")
        });
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
       <button 
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-primary font-bold transition-colors"
       >
        <ArrowLeft size={18} />
        Zurück
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
          <div className="flex justify-center mb-16">
            <SellwerkLogo size="lg" />
          </div>

          <div className="bg-white border border-slate-100 p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            <div className="relative z-10">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                    <ShieldCheck size={36} />
                </div>
                <h2 className="text-4xl font-display font-black text-slate-900 mb-3 tracking-tight">Willkommen zurück</h2>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">Geben Sie Ihre E-Mail ein, um Zugriff auf Ihr SELLWERK Dashboard zu erhalten.</p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mail@ihr-unternehmen.de"
                        required
                        className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg font-medium text-slate-800"
                    />
                    <button 
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-primary transition-all shadow-2xl shadow-slate-900/10 hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group/btn flex items-center justify-center gap-2"
                    >
                        {isLoggingIn ? "Wird verifiziert..." : "Sicheres Login"}
                    </button>
                </form>
            </div>
          </div>
          <p className="mt-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
            Neu hier? Ihre E-Mail registriert automatisch Ihr Profil.
          </p>
      </motion.div>
    </main>
  );
}

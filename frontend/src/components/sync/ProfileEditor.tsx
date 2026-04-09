"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Building2, MapPin, Phone, Globe, Clock, Loader2, Target } from "lucide-react";
import { motion } from "framer-motion";

const profileSchema = z.object({
  business_name: z.string().min(2, "Name ist erforderlich"),
  address: z.string().min(5, "Adresse ist erforderlich"),
  phone: z.string().min(5, "Telefonnummer ist erforderlich"),
  website: z.string().url("Gültige URL erforderlich").or(z.literal("")),
  hours: z.object({
    mon: z.string(),
    tue: z.string(),
    wed: z.string(),
    thu: z.string(),
    fri: z.string(),
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditorProps {
  initialData?: Partial<ProfileFormValues>;
  onSave: (data: ProfileFormValues) => void;
  isLoading?: boolean;
}

export function ProfileEditor({ initialData, onSave, isLoading }: ProfileEditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      business_name: initialData?.business_name || "",
      address: initialData?.address || "",
      phone: initialData?.phone || "",
      website: initialData?.website || "",
      hours: initialData?.hours || {
        mon: "09:00 - 18:00",
        tue: "09:00 - 18:00",
        wed: "09:00 - 18:00",
        thu: "09:00 - 18:00",
        fri: "09:00 - 18:00",
      },
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden font-sans"
    >
      <div className="bg-primary px-10 py-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Target size={22} />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.2em] opacity-90">Daten-Verifizierung</span>
          </div>
          <h2 className="text-4xl font-display font-black tracking-tight">Ihre Schaltzentrale</h2>
          <p className="text-white/80 mt-3 text-lg font-medium max-w-xl">Diese Daten bilden die „Single Source of Truth“ für alle 42+ Plattformen im SELLWERK Netzwerk.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business Name */}
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Building2 size={16} className="text-primary" />
              Unternehmensname
            </label>
            <input
              {...register("business_name")}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-700"
              placeholder="z.B. Bäckerei Müller GmbH"
            />
            {errors.business_name && <p className="text-red-500 text-xs font-bold">{errors.business_name.message}</p>}
          </div>

          {/* Address */}
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              Adresse
            </label>
            <input
              {...register("address")}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-700"
              placeholder="Straße, Hausnummer, PLZ & Stadt"
            />
          </div>

          {/* Phone */}
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Phone size={16} className="text-primary" />
              Telefon
            </label>
            <input
              {...register("phone")}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-700"
              placeholder="+49 123 456789"
            />
          </div>

          {/* Website */}
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Globe size={16} className="text-primary" />
              Website
            </label>
            <input
              {...register("website")}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-700"
              placeholder="https://deine-website.de"
            />
          </div>
        </div>

        {/* Hours section */}
        <div className="pt-8 border-t border-slate-100">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
                <Clock size={16} className="text-primary" />
                Öffnungszeiten
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Mo - Fr</span>
                    <input {...register("hours.mon")} className="bg-transparent font-bold text-slate-800 outline-none w-full" />
                </div>
            </div>
        </div>

        <div className="pt-10">
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-primary transition-all shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group text-lg"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save size={22} className="group-hover:scale-110 transition-transform" />
                Master-Profil validieren & synchronisieren
              </>
            )}
          </button>
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 leading-relaxed px-12">
            SELLWERK Professional Search Engine Sync • Compliance v2.4
          </p>
        </div>
      </form>
    </motion.div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Building2, MapPin, Phone, Globe, Clock, Loader2, Sparkles } from "lucide-react";
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
      className="w-full max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-slate-100 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles size={18} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Master Profil Management</span>
        </div>
        <h2 className="text-3xl font-bold">Deine Schaltzentrale</h2>
        <p className="text-blue-100 mt-2">Diese Daten bilden die „Single Source of Truth“ für alle 40+ Portale.</p>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Building2 size={16} className="text-blue-500" />
              Unternehmensname
            </label>
            <input
              {...register("business_name")}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="z.B. Bäckerei Müller GmbH"
            />
            {errors.business_name && <p className="text-red-500 text-xs">{errors.business_name.message}</p>}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              Adresse
            </label>
            <input
              {...register("address")}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="Straße, Hausnummer, PLZ & Stadt"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Phone size={16} className="text-blue-500" />
              Telefon
            </label>
            <input
              {...register("phone")}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="+49 123 456789"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Globe size={16} className="text-blue-500" />
              Website
            </label>
            <input
              {...register("website")}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="https://deine-website.de"
            />
          </div>
        </div>

        {/* Hours section (Simplified for MVP) */}
        <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                <Clock size={16} className="text-blue-500" />
                Öffnungszeiten (Beispielhaft)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Mo - Fr</span>
                    <input {...register("hours.mon")} className="bg-transparent font-semibold text-slate-700 outline-none w-full" />
                </div>
            </div>
        </div>

        <div className="pt-8">
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save size={20} className="group-hover:scale-110 transition-transform" />
                Master-Daten validieren & speichern
              </>
            )}
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed px-12">
            Nach der Speicherung kannst du den „Magic Sync“ starten, um diese Daten auf allen Plattformen abzugleichen.
          </p>
        </div>
      </form>
    </motion.div>
  );
}

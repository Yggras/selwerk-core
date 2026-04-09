"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Save,
  Building2,
  MapPin,
  Phone,
  Globe,
  Clock,
  Loader2,
  Target,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSync } from "@/hooks/useSync";
import { useRouter } from "next/navigation";
import { SellwerkLogo } from "@/components/brand/SellwerkLogo";

// ─── Schema ──────────────────────────────────
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

// ─── Red Flag detection helper ───────────────
// Fields that the Audit found missing or inconsistent
function detectRedFlags(profile: any): Set<string> {
  const flags = new Set<string>();
  if (!profile?.business_name) flags.add("business_name");
  if (!profile?.address) flags.add("address");
  if (!profile?.phone) flags.add("phone");
  if (!profile?.website) flags.add("website");
  return flags;
}

// ─── Field wrapper component ─────────────────
function Field({
  label,
  icon: Icon,
  error,
  isRedFlag,
  children,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  isRedFlag?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
        <Icon size={16} className="text-primary" />
        {label}
        {isRedFlag && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100 normal-case tracking-wide">
            <AlertTriangle size={11} />
            Audit-Hinweis
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs font-bold">{error}</p>
      )}
    </div>
  );
}

// ─── Page Component ──────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const { profile, updateProfile, isUpdating, isAuthenticated } = useSync();

  // Build initial values from the global SSOT store
  const redFlags = detectRedFlags(profile);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      business_name: profile?.business_name || "",
      address: profile?.address || "",
      phone: profile?.phone || "",
      website: profile?.website || "",
      hours: profile?.hours || {
        mon: "09:00 - 18:00",
        tue: "09:00 - 18:00",
        wed: "09:00 - 18:00",
        thu: "09:00 - 18:00",
        fri: "09:00 - 18:00",
      },
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // 1. Persist to global state (backend mock call)
    updateProfile(data, {
      onSuccess: () => {
        // 2. THEN navigate to the Command Center
        router.push("/dashboard/sync-center");
      },
    });
  };

  // Input styling with conditional red-flag accent
  const inputClass = (field: string) =>
    `w-full bg-slate-50 border rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-700 ${
      redFlags.has(field)
        ? "border-amber-200 bg-amber-50/30"
        : "border-slate-100"
    }`;

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      {/* ── Header ─────────────────────────── */}
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-50">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => router.push("/dashboard")}
        >
          <SellwerkLogo size="md" />
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Zurück zum Dashboard
        </button>
      </nav>

      {/* ── Content ────────────────────────── */}
      <div className="flex-1 flex items-start justify-center py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          {/* ── Teal Header ────────────────── */}
          <div className="bg-primary px-10 py-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Target size={22} />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.2em] opacity-90">
                  Single Source of Truth
                </span>
              </div>
              <h1 className="text-4xl font-display font-black tracking-tight">
                Master-Profil
              </h1>
              <p className="text-white/80 mt-3 text-lg font-medium max-w-xl">
                Diese Daten bilden die Grundlage für alle 42+ Plattformen im
                SELLWERK Netzwerk. Korrekturen hier werden überall
                synchronisiert.
              </p>

              {redFlags.size > 0 && (
                <div className="mt-6 inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold">
                  <AlertTriangle size={16} />
                  {redFlags.size} Feld{redFlags.size > 1 ? "er" : ""}{" "}
                  benötig{redFlags.size > 1 ? "en" : "t"} Ihre Aufmerksamkeit
                </div>
              )}
            </div>
          </div>

          {/* ── Form Body ──────────────────── */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field
                label="Unternehmensname"
                icon={Building2}
                error={errors.business_name?.message}
                isRedFlag={redFlags.has("business_name")}
              >
                <input
                  {...register("business_name")}
                  className={inputClass("business_name")}
                  placeholder="z.B. Bäckerei Müller GmbH"
                />
              </Field>

              <Field
                label="Adresse"
                icon={MapPin}
                error={errors.address?.message}
                isRedFlag={redFlags.has("address")}
              >
                <input
                  {...register("address")}
                  className={inputClass("address")}
                  placeholder="Straße, Hausnummer, PLZ & Stadt"
                />
              </Field>

              <Field
                label="Telefon"
                icon={Phone}
                error={errors.phone?.message}
                isRedFlag={redFlags.has("phone")}
              >
                <input
                  {...register("phone")}
                  className={inputClass("phone")}
                  placeholder="+49 123 456789"
                />
              </Field>

              <Field
                label="Website"
                icon={Globe}
                error={errors.website?.message}
                isRedFlag={redFlags.has("website")}
              >
                <input
                  {...register("website")}
                  className={inputClass("website")}
                  placeholder="https://deine-website.de"
                />
              </Field>
            </div>

            {/* ── Opening Hours ─────────────── */}
            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
                <Clock size={16} className="text-primary" />
                Öffnungszeiten
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {(["mon", "tue", "wed", "thu", "fri"] as const).map((day) => (
                  <div
                    key={day}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-100"
                  >
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">
                      {day === "mon"
                        ? "Montag"
                        : day === "tue"
                          ? "Dienstag"
                          : day === "wed"
                            ? "Mittwoch"
                            : day === "thu"
                              ? "Donnerstag"
                              : "Freitag"}
                    </span>
                    <input
                      {...register(`hours.${day}`)}
                      className="bg-transparent font-bold text-slate-800 outline-none w-full text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Submit CTA ───────────────── */}
            <div className="pt-10">
              <button
                id="magic-sync-submit"
                type="submit"
                disabled={isUpdating}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-primary transition-all shadow-2xl shadow-slate-900/10 hover:shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group text-lg"
              >
                {isUpdating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Save
                      size={22}
                      className="group-hover:scale-110 transition-transform"
                    />
                    Magic Sync starten
                  </>
                )}
              </button>
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 leading-relaxed px-12">
                SELLWERK Professional Search Engine Sync • Compliance v2.4
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}

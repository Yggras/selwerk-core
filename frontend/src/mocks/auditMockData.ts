// ─── Mock Audit Data ─────────────────────────────────────
// 12 Action Items across 4 categories for the Digi-Check
// Aligned per /grill-me session: mock_data_journey.json

export type ActionCategory = "listing" | "reputation" | "social" | "website";
export type ActionSeverity = "critical" | "high" | "medium" | "low";

export interface ActionItem {
  id: string;
  category: ActionCategory;
  title: string;
  description: string;
  severity: ActionSeverity;
  impact: number;
  target_route: string;
  cta_label: string;
  mission_key: string; // Used for ?mission= URL param
}

export interface AuditCategory {
  key: ActionCategory;
  label: string;
  subtitle: string;
  score: number; // 0-100, lower = worse
  icon: string; // lucide icon name
  color: string;
}

// ─── The 4 Categories ────────────────────────────────────
export const AUDIT_CATEGORIES: AuditCategory[] = [
  {
    key: "listing",
    label: "Präsenz-Tiefe",
    subtitle: "Online Listings",
    score: 28,
    icon: "MapPin",
    color: "#EF4444", // red
  },
  {
    key: "reputation",
    label: "Kunden-Vertrauen",
    subtitle: "Reputation",
    score: 35,
    icon: "Star",
    color: "#F59E0B", // amber
  },
  {
    key: "social",
    label: "Digitale Reichweite",
    subtitle: "Social Media",
    score: 42,
    icon: "Share2",
    color: "#3B82F6", // blue
  },
  {
    key: "website",
    label: "Web-Integrität",
    subtitle: "Website",
    score: 22,
    icon: "Globe",
    color: "#8B5CF6", // purple
  },
];

// ─── The 12 Action Items ─────────────────────────────────
export const ALL_ACTION_ITEMS: ActionItem[] = [
  // ── LISTING (Online-Präsenz) ───────────────────────────
  {
    id: "listing-1",
    category: "listing",
    title: "Doppelte Google-Profile entdeckt",
    description:
      "Wir haben 2 doppelte Einträge auf Google Maps gefunden. Dies verwirrt Kunden und schadet Ihrem Ranking erheblich.",
    severity: "critical",
    impact: 50,
    target_route: "/dashboard/profile",
    cta_label: "Profil korrigieren",
    mission_key: "duplicate_google",
  },
  {
    id: "listing-2",
    category: "listing",
    title: "Inkonsistente Öffnungszeiten",
    description:
      "Ihre Öffnungszeiten auf Google und Bing unterscheiden sich. Kunden, die vor verschlossener Tür stehen, hinterlassen schlechte Bewertungen.",
    severity: "high",
    impact: 30,
    target_route: "/dashboard/profile",
    cta_label: "Zeiten synchronisieren",
    mission_key: "inconsistent_hours",
  },
  {
    id: "listing-3",
    category: "listing",
    title: "Telefonnummer fehlt auf 5 Plattformen",
    description:
      "Auf Yelp, Bing, Apple Maps, TomTom und Foursquare fehlt Ihre Telefonnummer. Verlorene Anrufe = verlorene Aufträge.",
    severity: "medium",
    impact: 20,
    target_route: "/dashboard/profile",
    cta_label: "Nummer hinterlegen",
    mission_key: "missing_phone",
  },

  // ── REPUTATION (Kunden-Stimmen) ────────────────────────
  {
    id: "reputation-1",
    category: "reputation",
    title: "Unbeantwortete 1-Stern-Bewertung",
    description:
      "Eine negative Bewertung ohne Antwort senkt Ihr Vertrauen bei Neukunden um bis zu 22%. Eine professionelle Antwort kann das umkehren.",
    severity: "critical",
    impact: 45,
    target_route: "/dashboard/reputation",
    cta_label: "Jetzt antworten",
    mission_key: "unanswered_review",
  },
  {
    id: "reputation-2",
    category: "reputation",
    title: "Durchschnittsbewertung unter 4.0",
    description:
      "Ihre aktuelle Durchschnittsbewertung liegt bei 3.7 Sternen. Ab 4.0 steigt die Klickrate auf Ihr Profil um 28%.",
    severity: "high",
    impact: 35,
    target_route: "/dashboard/reputation",
    cta_label: "Strategie starten",
    mission_key: "low_rating",
  },
  {
    id: "reputation-3",
    category: "reputation",
    title: "Antwortquote unter 15%",
    description:
      "Sie beantworten nur 12% Ihrer Bewertungen. Google bevorzugt aktive Geschäftsinhaber im lokalen Ranking.",
    severity: "medium",
    impact: 25,
    target_route: "/dashboard/reputation",
    cta_label: "Antworten verfassen",
    mission_key: "low_response_rate",
  },

  // ── SOCIAL MEDIA (Soziale Netzwerke) ───────────────────
  {
    id: "social-1",
    category: "social",
    title: "Facebook-Profilname weicht ab",
    description:
      "Ihr Facebook-Profil heißt 'Bäckerei M.' statt 'Bäckerei Müller GmbH'. Inkonsistenzen verwirren den Google-Algorithmus.",
    severity: "high",
    impact: 30,
    target_route: "/dashboard/social",
    cta_label: "Profil anpassen",
    mission_key: "facebook_mismatch",
  },
  {
    id: "social-2",
    category: "social",
    title: "Instagram seit 60+ Tagen inaktiv",
    description:
      "Ihr letzter Instagram-Beitrag ist über 2 Monate alt. Regelmäßige Aktivität steigert Ihre lokale Sichtbarkeit.",
    severity: "medium",
    impact: 20,
    target_route: "/dashboard/social",
    cta_label: "Beitrag planen",
    mission_key: "instagram_inactive",
  },
  {
    id: "social-3",
    category: "social",
    title: "LinkedIn Firmenseite nicht beansprucht",
    description:
      "Ihre LinkedIn-Firmenseite existiert, wurde aber nie verifiziert. Das ist ein ungenutztes B2B-Potenzial.",
    severity: "low",
    impact: 15,
    target_route: "/dashboard/social",
    cta_label: "Jetzt beanspruchen",
    mission_key: "linkedin_unclaimed",
  },

  // ── WEBSITE (Web-Sichtbarkeit) ─────────────────────────
  {
    id: "website-1",
    category: "website",
    title: "Kritischer Mobile PageSpeed-Fehler",
    description:
      "Ihre mobile Ladezeit beträgt 8.2 Sekunden. Google empfiehlt unter 2.5s. Das kostet Sie 53% der mobilen Besucher.",
    severity: "critical",
    impact: 50,
    target_route: "/dashboard/editor",
    cta_label: "Website optimieren",
    mission_key: "pagespeed_critical",
  },
  {
    id: "website-2",
    category: "website",
    title: "DSGVO Cookie-Banner fehlt/ungültig",
    description:
      "Ihr Cookie-Banner entspricht nicht den aktuellen DSGVO-Anforderungen. Das ist ein rechtliches Risiko.",
    severity: "high",
    impact: 40,
    target_route: "/dashboard/editor",
    cta_label: "Banner einrichten",
    mission_key: "gdpr_banner",
  },
  {
    id: "website-3",
    category: "website",
    title: "Kontaktformular hat Validierungsfehler",
    description:
      "Ihr Kontaktformular lässt leere Pflichtfelder durch. Das führt zu Spam und verlorenen echten Anfragen.",
    severity: "high",
    impact: 35,
    target_route: "/dashboard/editor",
    cta_label: "Formular reparieren",
    mission_key: "contact_form_broken",
  },
];

// ─── Utility: Get global score ───────────────────────────
export function getGlobalScore(): number {
  const total = AUDIT_CATEGORIES.reduce((sum, cat) => sum + cat.score, 0);
  return Math.round(total / AUDIT_CATEGORIES.length);
}

// ─── Utility: Get items by category ──────────────────────
export function getItemsByCategory(
  category: ActionCategory
): ActionItem[] {
  return ALL_ACTION_ITEMS.filter((item) => item.category === category);
}

// ─── Utility: Product Tour batch (1 per category) ────────
// Returns the first uncompleted item from each category
export function getProductTourBatch(
  completedIds: string[]
): ActionItem[] {
  const categories: ActionCategory[] = [
    "listing",
    "reputation",
    "social",
    "website",
  ];
  const batch: ActionItem[] = [];

  for (const cat of categories) {
    const items = getItemsByCategory(cat);
    const uncompleted = items.find((i) => !completedIds.includes(i.id));
    if (uncompleted && batch.length < 3) {
      batch.push(uncompleted);
    }
  }

  // If we didn't get 3, fill from remaining uncompleted items
  if (batch.length < 3) {
    const batchIds = new Set(batch.map((b) => b.id));
    const remaining = ALL_ACTION_ITEMS.filter(
      (i) => !completedIds.includes(i.id) && !batchIds.has(i.id)
    ).sort((a, b) => b.impact - a.impact);

    for (const item of remaining) {
      if (batch.length >= 3) break;
      batch.push(item);
    }
  }

  return batch;
}

// ─── Utility: Get action item by mission key ─────────────
export function getItemByMissionKey(
  key: string
): ActionItem | undefined {
  return ALL_ACTION_ITEMS.find((item) => item.mission_key === key);
}

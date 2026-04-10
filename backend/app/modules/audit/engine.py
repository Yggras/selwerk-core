import httpx
import os
import asyncio
from typing import Dict, Any, List
from .schemas import AuditStatus, RedFlag

class InsitesClient:
    def __init__(self):
        self.api_key = os.getenv("INSITES_API_KEY", "")
        self.base_url = "https://api.insites.com/api/v1"
        self.headers = {"api-key": self.api_key}

    async def trigger_report(self, url: str, name: str = None) -> str:
        # For now, we return a mock ID if no API key is present
        if not self.api_key:
            return "mock_report_123"

        async with httpx.AsyncClient() as client:
            payload = {"url": url}
            if name:
                payload["name"] = name
            
            response = await client.post(
                f"{self.base_url}/report",
                headers=self.headers,
                json=payload
            )
            data = response.json()
            return data.get("reportId")

    async def fetch_report(self, report_id: str) -> Dict[str, Any]:
        if report_id == "mock_report_123":
            # Simulate a report lifecycle
            return {"report_status": "complete", "status": "success", "report": self._get_mock_data()}

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/report/{report_id}",
                headers=self.headers
            )
            return response.json()

    def _get_mock_data(self) -> Dict[str, Any]:
        return {
            "domain": "test-brot.de",
            "overall_score": 42,
            "local_presence": {
                "detected_phone": "+49 123 456789",
                "detected_name": "Baeckerei Mueller GmbH",
                "detected_address": "Hauptstraße 1, 12345 Berlin"
            },
            "listings": {
                "duplicate_google_profiles": 2,
                "inconsistent_hours_platforms": ["Google", "Bing Places"],
                "missing_phone_platforms": [
                    "Yelp",
                    "Apple Maps",
                    "TomTom",
                    "Foursquare",
                    "Bing Places"
                ]
            },
            "reputation": {
                "average_rating": 3.7,
                "unanswered_negative_reviews": 1,
                "response_rate_percent": 12
            },
            "social": {
                "facebook_name_mismatch": True,
                "instagram_last_post_days": 64,
                "linkedin_claimed": False
            },
            "website": {
                "mobile_pagespeed_seconds": 8.2,
                "cookie_banner_valid": False,
                "contact_form_valid": False
            }
        }

class RuleParser:
    @staticmethod
    def extract_red_flags(data: Dict[str, Any], pedant: bool = True) -> List[RedFlag]:
        flags = []

        local = data.get("local_presence", {})
        detected_name = local.get("detected_name", "")

        if pedant:
            if "GmbH" not in detected_name and "UG" not in detected_name:
                flags.append(RedFlag(
                    type="LEGAL_FORM_MISSING",
                    title="Rechtsform fehlt",
                    description=f"Dein Firmenname '{detected_name}' enthält keine Rechtsform (GmbH, UG etc.) bei Google Maps.",
                    severity="medium",
                    platform="Google"
                ))

        listings = data.get("listings", {})
        duplicate_google_profiles = listings.get("duplicate_google_profiles", 0)
        if duplicate_google_profiles > 0:
            flags.append(RedFlag(
                type="DUPLICATE_GOOGLE_LISTING",
                title="Doppelte Google-Profile entdeckt",
                description=f"Wir haben {duplicate_google_profiles} doppelte Eintraege gefunden. Das verwirrt Kunden und schwaecht Ihre Sichtbarkeit.",
                severity="high",
                platform="Google"
            ))

        inconsistent_hours_platforms = listings.get("inconsistent_hours_platforms", [])
        if inconsistent_hours_platforms:
            platform_list = ", ".join(inconsistent_hours_platforms)
            flags.append(RedFlag(
                type="INCONSISTENT_HOURS",
                title="Inkonsistente Oeffnungszeiten",
                description=f"Ihre Oeffnungszeiten unterscheiden sich zwischen {platform_list}. Das fuehrt zu unnoetigen Frustmomenten bei Kunden.",
                severity="high",
                platform="Listings"
            ))

        missing_phone_platforms = listings.get("missing_phone_platforms", [])
        if missing_phone_platforms:
            flags.append(RedFlag(
                type="MISSING_PHONE_COVERAGE",
                title="Telefonnummer fehlt auf mehreren Plattformen",
                description=f"Auf {len(missing_phone_platforms)} Plattformen fehlt Ihre Telefonnummer. Das kostet direkte Kontaktanfragen.",
                severity="medium",
                platform="Listings"
            ))

        reputation = data.get("reputation", {})
        unanswered_negative_reviews = reputation.get("unanswered_negative_reviews", 0)
        if unanswered_negative_reviews > 0:
            flags.append(RedFlag(
                type="UNANSWERED_NEGATIVE_REVIEW",
                title="Unbeantwortete negative Bewertung",
                description="Mindestens eine kritische Bewertung wurde nicht beantwortet. Eine professionelle Antwort kann Vertrauen zurueckgewinnen.",
                severity="high",
                platform="Google"
            ))

        average_rating = reputation.get("average_rating")
        if average_rating is not None and average_rating < 4.0:
            flags.append(RedFlag(
                type="LOW_AVERAGE_RATING",
                title="Durchschnittsbewertung unter 4.0",
                description=f"Ihre aktuelle Bewertung liegt bei {average_rating}. Eine Steigerung ueber 4.0 verbessert die lokale Klickrate deutlich.",
                severity="high",
                platform="Reputation"
            ))

        response_rate_percent = reputation.get("response_rate_percent")
        if response_rate_percent is not None and response_rate_percent < 20:
            flags.append(RedFlag(
                type="LOW_REVIEW_RESPONSE_RATE",
                title="Antwortquote auf Bewertungen ist zu niedrig",
                description=f"Sie beantworten derzeit nur {response_rate_percent}% der Bewertungen. Aktive Kommunikation wirkt sich positiv auf Ranking und Vertrauen aus.",
                severity="medium",
                platform="Reputation"
            ))

        social = data.get("social", {})
        if social.get("facebook_name_mismatch") is True:
            flags.append(RedFlag(
                type="FACEBOOK_NAME_MISMATCH",
                title="Facebook-Profilname weicht vom Firmennamen ab",
                description="Ihr Facebook-Name ist nicht konsistent mit dem Hauptprofil. Uneinheitliche Nennung erschwert Plattformabgleiche.",
                severity="medium",
                platform="Facebook"
            ))

        instagram_last_post_days = social.get("instagram_last_post_days")
        if instagram_last_post_days is not None and instagram_last_post_days >= 60:
            flags.append(RedFlag(
                type="INSTAGRAM_INACTIVE",
                title="Instagram-Kanal ist inaktiv",
                description=f"Der letzte Beitrag liegt {instagram_last_post_days} Tage zurueck. Kontinuierliche Aktivitaet verbessert Reichweite und Markenwahrnehmung.",
                severity="medium",
                platform="Instagram"
            ))

        if social.get("linkedin_claimed") is False:
            flags.append(RedFlag(
                type="LINKEDIN_UNCLAIMED",
                title="LinkedIn-Firmenseite nicht beansprucht",
                description="Ihre Firmenseite auf LinkedIn ist nicht verifiziert. Dadurch verschenken Sie B2B-Sichtbarkeit.",
                severity="low",
                platform="LinkedIn"
            ))

        website = data.get("website", {})
        mobile_pagespeed_seconds = website.get("mobile_pagespeed_seconds")
        if mobile_pagespeed_seconds is not None and mobile_pagespeed_seconds > 2.5:
            severity = "high" if mobile_pagespeed_seconds > 5 else "medium"
            flags.append(RedFlag(
                type="MOBILE_PAGESPEED_CRITICAL",
                title="Mobile Ladezeit ist zu hoch",
                description=f"Ihre mobile Ladezeit liegt bei {mobile_pagespeed_seconds} Sekunden. Zielwert fuer stabile Conversion ist unter 2.5 Sekunden.",
                severity=severity,
                platform="Website"
            ))

        if website.get("cookie_banner_valid") is False:
            flags.append(RedFlag(
                type="GDPR_BANNER_INVALID",
                title="Cookie-Banner ist nicht DSGVO-konform",
                description="Ihr aktuelles Banner entspricht nicht den rechtlichen Anforderungen. Das stellt ein vermeidbares Risiko dar.",
                severity="high",
                platform="Website"
            ))

        if website.get("contact_form_valid") is False:
            flags.append(RedFlag(
                type="CONTACT_FORM_VALIDATION_BROKEN",
                title="Kontaktformular hat Validierungsfehler",
                description="Ihr Formular akzeptiert unvollstaendige Eingaben. Das fuehrt zu Datenmuell und verlorenen qualifizierten Leads.",
                severity="medium",
                platform="Website"
            ))

        return flags

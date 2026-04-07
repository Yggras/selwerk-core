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
                "detected_name": "Bäckerei Müller",
                "detected_address": "Hauptstraße 1, 12345 Berlin"
            },
            "facebook_page": {
                "page_link": "https://facebook.com/mueller-brot",
                "page_likes": 12
            }
        }

class RuleParser:
    @staticmethod
    def extract_red_flags(data: Dict[str, Any], pedant: bool = True) -> List[RedFlag]:
        flags = []
        
        # Example Heuristic: Name Check
        local = data.get("local_presence", {})
        detected_name = local.get("detected_name", "")
        
        # Logic for "Pedant" vs "Pragmatiker"
        if pedant:
            if "GmbH" not in detected_name:
                flags.append(RedFlag(
                    type="LEGAL_FORM_MISSING",
                    title="Rechtsform fehlt",
                    description=f"Dein Firmenname '{detected_name}' enthält keine Rechtsform (GmbH, UG etc.) bei Google Maps.",
                    severity="medium",
                    platform="Google"
                ))
        
        # High Impact Error (always medium/high)
        if not data.get("facebook_page", {}).get("page_link"):
            flags.append(RedFlag(
                type="MISSING_SOCIAL",
                title="Keine Facebook-Präsenz",
                description="Kunden können dich auf sozialen Netzwerken nicht finden.",
                severity="high",
                platform="Facebook"
            ))

        return flags

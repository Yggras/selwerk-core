from typing import Dict

# Shared in-memory storage for MVP. 
# Allows the sync module to access audit results for ingestion.
audit_store: Dict[str, Dict] = {}

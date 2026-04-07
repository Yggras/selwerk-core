# ADR 001: Insites API Integration - Polling vs. Webhooks

## Status
Accepted

## Context
The "Digital Janitor" application requires fetching SEO and Online Presence data using the Insites API. The Insites API offers two methods for receiving audit results:
1. **Webhooks (`onCompletion`)**: Insites sends a POST request to our server when the audit finishes.
2. **Polling**: Our server periodically makes GET requests to `api.insites.com/api/v1/report/[REPORT ID]` or `/v1/llm/report-fetch/` to check the status.

During the War Room Architecture Council, `@02_SENIOR_BACKEND_DEV` raised a constraint regarding Local-First Developer Experience: Webhooks require a publicly accessible URL, which means developers would need to use tools like `ngrok` to receive callbacks locally.

## Decision
We decided to completely strip out Webhook Callbacks for the MVP and local development. Instead, we will implement a **Strict Polling Strategy**. 

- The Next.js frontend will use React Query to poll our FastAPI backend.
- The FastAPI backend will check the Insites API for completion (`status: complete`).
- To prevent rate-limiting issues, UI polling intervals will use an exponential backoff or a smart fixed interval (e.g., every 5-10 seconds) during the "Storyteller" loading sequence.

## Consequences
**Positive:**
- Seamless local development environment out-of-the-box (`docker-compose up` is enough).
- Simpler error handling and state management on the client side without needing real-time socket connections to push webhook results to the frontend.

**Negative:**
- Slightly less efficient regarding network traffic compared to a pure webhook approach.
- Requires careful polling configuration to avoid hitting API rate limits.

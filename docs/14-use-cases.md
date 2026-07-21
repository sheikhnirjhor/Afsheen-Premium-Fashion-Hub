# 14. Use Cases

## Use Case UC-01: Interact with AI Stylist
* **Actor:** Customer
* **Pre-condition:** Backend API and Gemini API service are running.
* **Main Scenario:**
  1. User opens AI Assistant modal.
  2. User inputs query (e.g., *"What matches red velvet heels?"*).
  3. Backend processes query via `@google/genai`.
  4. Response is rendered in the user chat interface.

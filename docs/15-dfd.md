# 15. Data Flow Diagram (DFD)

## Level 1 Data Flow

```mermaid
graph TD
    User([Customer]) -->|1. Submit Chat Query| Backend[Express Server]
    Backend -->|2. Send Prompt| GenAI[Google GenAI API]
    GenAI -->|3. Return Recommendation| Backend
    Backend -->|4. Send JSON Response| User

# 18. System Design & Architecture

```mermaid
graph LR
    subgraph Client Tier
        React[React 19 Frontend]
    end

    subgraph Backend Tier
        Express[Node.js / Express Server]
    end

    subgraph External Services
        Gemini[Google GenAI SDK]
    end

    React <-->|REST API / HTTP| Express
    Express <-->|SDK Connection| Gemini

# 19. Technical Design Document (TDD)

## Component Breakdown
* `App.tsx`: Main application router and state container.
* `server.js`: Express server initializing CORS, JSON parser, and routes.

## API Endpoint Structure
* `POST /api/chat`: Accepts `{ prompt: string }` and returns `{ response: string }`

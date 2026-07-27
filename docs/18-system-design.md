# 18 - System Design

## 1. Purpose

This document describes the high-level architecture, component design, and technical decisions for the Afsheen Premium Fashion Hub.

## 2. Architecture Overview

The system follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  React SPA + Tailwind CSS                               │    │
│  │  ├── Routing (React Router v6)                          │    │
│  │  ├── State Management (React Context + useReducer)      │    │
│  │  ├── UI Components (custom + Tailwind)                  │    │
│  │  └── Firebase Client SDK (Auth, Firestore)              │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────────┘
                            │ REST API / WebSocket
┌───────────────────────────┴─────────────────────────────────────┐
│                        APPLICATION TIER                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  FastAPI (Python 3.10+)                                 │    │
│  │  ├── Route Handlers (async functions)                   │    │
│  │  ├── Pydantic Models (request/response validation)      │    │
│  │  ├── Firebase Admin SDK (server-side operations)        │    │
│  │  ├── WebSocket Manager (real-time chat)                 │    │
│  │  └── Middleware (CORS, auth verification)               │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────┴─────────────────────────────────────┐
│                          DATA TIER                               │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ Firebase Auth│  │ Firebase Firestore│  │ Firebase Storage │  │
│  │ (Identity)   │  │ (Documents)       │  │ (Images/Files)  │  │
│  └──────────────┘  └──────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Frontend Architecture

### 3.1 Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── CartProvider (Context)
│       └── Layout
│           ├── Navbar
│           │   ├── Logo
│           │   ├── Navigation Links
│           │   ├── Search Bar
│           │   └── Cart Icon + Count
│           ├── <Routes>
│           │   ├── Home
│           │   │   ├── Hero
│           │   │   ├── FeaturedCategories
│           │   │   ├── FeaturedProducts
│           │   │   ├── WhyChooseUs
│           │   │   └── Testimonials
│           │   ├── Products (with filters)
│           │   ├── ProductDetail
│           │   ├── Cart
│           │   ├── Checkout (multi-step)
│           │   ├── Login / Register / ForgotPassword
│           │   ├── OrderHistory / OrderTracking
│           │   ├── BookingGuidelines / ReturnPolicy
│           │   ├── AdminDashboard
│           │   └── ModeratorDashboard
│           ├── ChatWidget (persistent)
│           └── Footer
```

### 3.2 State Management

| Context | Scope | Data |
|---------|-------|------|
| AuthContext | Global | User, isAuthenticated, role, login/logout functions |
| CartContext | Global | Items, total, addToCart, removeFromCart, updateQuantity |

### 3.3 Routing

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Home | Public | Landing page |
| `/products` | Products | Public | Product catalog |
| `/product/:id` | ProductDetail | Public | Single product view |
| `/cart` | Cart | Public | Shopping cart |
| `/checkout` | Checkout | Auth required | Multi-step checkout |
| `/login` | Login | Guest only | Login page |
| `/register` | Register | Guest only | Registration page |
| `/forgot-password` | ForgotPassword | Guest only | Password reset |
| `/orders` | OrderHistory | Auth required | Past orders |
| `/order/:id` | OrderTracking | Auth required | Order details |
| `/admin` | AdminDashboard | Admin only | Admin panel |
| `/moderator` | ModeratorDashboard | Moderator+ | Support panel |
| `/booking-guidelines` | BookingGuidelines | Public | Info page |
| `/return-policy` | ReturnPolicy | Public | Info page |

### 3.4 Design System

| Element | Specification |
|---------|-------------|
| Primary Color | Gold (#C9A96E) |
| Secondary Color | Navy (#1B2A4A) |
| Accent Color | Burgundy (#800020) |
| Background | Cream (#FAF7F2) |
| Font - Headings | Playfair Display |
| Font - Body | Inter |
| Border Radius | Rounded (8px cards, 6px buttons) |
| Shadows | Subtle (sm for cards, md for modals) |

## 4. Backend Architecture

### 4.1 Application Structure

```
backend/
├── main.py              # FastAPI app initialization, CORS, routes
├── config.py            # Environment variables, settings
├── firebase_admin_config.py  # Firebase Admin SDK initialization
├── requirements.txt     # Python dependencies
├── models/
│   ├── __init__.py
│   └── schemas.py       # Pydantic models (User, Product, Order, etc.)
├── routes/
│   ├── __init__.py
│   ├── auth.py          # Registration, login, profile endpoints
│   ├── products.py      # Product CRUD endpoints
│   ├── orders.py        # Order creation, listing, status endpoints
│   └── chat.py          # Chat REST + WebSocket endpoints
├── middleware/
│   └── __init__.py      # Custom middleware (auth, logging)
└── services/
    └── __init__.py      # Business logic services
```

### 4.2 API Design Principles

- RESTful resource naming (`/api/products`, `/api/orders`)
- JSON request/response bodies
- Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Consistent error response format: `{ "detail": "Error message" }`
- Firebase ID token verification for protected endpoints
- Async handlers for all I/O operations

### 4.3 Middleware Stack

```
Request → CORS → Auth Verification → Route Handler → Response
                      │
                 Firebase Token
                 Verification
```

## 5. Data Flow Architecture

### 5.1 Authentication Flow

```
1. User enters credentials → React (Firebase Auth SDK)
2. Firebase authenticates → Returns JWT token
3. Token stored in browser (Firebase persistence)
4. API calls include token in Authorization header
5. FastAPI middleware verifies token with Firebase Admin
6. User profile fetched from Firestore
```

### 5.2 Order Placement Flow

```
1. User fills checkout form → React
2. Frontend sends order payload → POST /api/orders
3. Backend validates with Pydantic schema
4. Backend verifies stock availability (Firestore)
5. Backend creates order document (Firestore)
6. Backend updates product stock (Firestore)
7. Backend clears user cart (Firestore)
8. Response sent to frontend with order ID
9. Frontend shows confirmation page
```

### 5.3 Real-time Chat Flow

```
1. User opens chat widget → WebSocket connection established
2. User sends message → WebSocket → FastAPI
3. Backend stores message in Firestore
4. Backend broadcasts to moderator WebSocket connections
5. Moderator responds → WebSocket → User receives in real-time
6. Messages persisted in Firestore for history
```

## 6. Deployment Architecture

```
┌─────────────────────────────────────────────┐
│                 GitHub                       │
│  (Source Code Repository)                   │
└──────────┬────────────────┬─────────────────┘
           │ Push           │ Push
           ▼                ▼
┌──────────────┐    ┌──────────────────┐
│   Vercel     │    │  Railway/Render  │
│  (Frontend)  │    │    (Backend)     │
│  Auto-deploy │    │   Auto-deploy    │
│  from main   │    │   from main      │
└──────────────┘    └──────────────────┘
           │                │
           ▼                ▼
┌─────────────────────────────────────────────┐
│           Firebase (Cloud)                   │
│  ├── Authentication                          │
│  ├── Firestore Database                      │
│  └── Storage (Images)                       │
└─────────────────────────────────────────────┘
```

## 7. Security Design

| Layer | Mechanism |
|-------|-----------|
| Transport | HTTPS enforced on all endpoints |
| Authentication | Firebase JWT tokens, verified server-side |
| Authorization | Role-based (customer, moderator, admin) |
| Data Access | Firestore security rules per collection |
| Input Validation | Pydantic models (server), form validation (client) |
| CORS | Whitelist of allowed origins |
| Secrets | Environment variables, never in code |
| XSS | React auto-escaping, Content Security Policy |

## 8. Scalability Considerations

| Aspect | Strategy |
|--------|---------|
| Frontend | CDN distribution via Vercel |
| Backend | Stateless API, horizontal scaling possible |
| Database | Firestore auto-scales, but optimize with indexes |
| Images | Firebase Storage with CDN caching |
| Chat | WebSocket connection pooling |

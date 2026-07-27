# 16 - Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
This SRS document specifies the complete software requirements for the Afsheen Premium Fashion Hub e-commerce platform. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope
The system is a full-stack web application consisting of:
- **Frontend:** React.js single-page application with Tailwind CSS
- **Backend:** FastAPI RESTful API with Python
- **Database:** Firebase Firestore (NoSQL)
- **Authentication:** Firebase Authentication

### 1.3 Definitions

| Term | Definition |
|------|-----------|
| SRS | Software Requirements Specification |
| API | Application Programming Interface |
| SPA | Single Page Application |
| CRUD | Create, Read, Update, Delete |
| JWT | JSON Web Token |
| CORS | Cross-Origin Resource Sharing |
| MVP | Minimum Viable Product |

## 2. Overall Description

### 2.1 Product Perspective
The Afsheen Premium Fashion Hub is a self-contained e-commerce system that interfaces with Firebase services for authentication and data storage. It does not depend on any existing system and is designed as a greenfield project.

### 2.2 Product Functions
- Customer browsing, searching, and purchasing of fashion products
- Admin management of product catalog, orders, and users
- Moderator management of customer support conversations
- Real-time chat between customers and support staff

### 2.3 User Classes

| User Class | Access Level | Authentication |
|-----------|-------------|---------------|
| Guest | Browse products, view public pages | None |
| Customer | + Cart, checkout, orders, chat | Email/Password, Google |
| Moderator | + Chat management, customer data | Email/Password (role: moderator) |
| Admin | + Full system management | Email/Password (role: admin) |

### 2.4 Operating Environment
- **Client:** Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Server:** Python 3.10+, FastAPI
- **Database:** Firebase Firestore (cloud-hosted)
- **Deployment:** Vercel (frontend), Railway/Render (backend)

### 2.5 Design Constraints
- Must use Firebase services for auth and database
- Must be mobile-first responsive
- Must support HTTPS
- Must comply with existing brand guidelines (colors, typography)

### 2.6 Assumptions
- Firebase free tier provides sufficient quota for MVP
- Users have modern browsers with JavaScript enabled
- Internet connectivity is available for all operations
- Product images will be provided by the business owner

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interfaces
- Responsive web interface optimized for 320px–2560px width
- Consistent luxury design theme (gold, navy, cream, burgundy palette)
- Accessible navigation with keyboard support
- Loading spinners for all async operations
- Toast notifications for user feedback

#### 3.1.2 Hardware Interfaces
- None (purely software application)

#### 3.1.3 Software Interfaces

| Interface | Technology | Purpose |
|-----------|-----------|---------|
| Firebase Auth SDK | JavaScript | Client-side authentication |
| Firebase Firestore SDK | JavaScript | Client-side database access |
| FastAPI | Python | Backend API framework |
| Firebase Admin SDK | Python | Server-side Firebase operations |

#### 3.1.4 Communication Interfaces
- HTTPS for all client-server communication
- WebSocket (WSS) for real-time chat
- SMTP for email notifications

### 3.2 Functional Requirements

#### Module: Authentication
- **FR-AUTH-01:** System shall register users with email/password
- **FR-AUTH-02:** System shall authenticate via Google OAuth
- **FR-AUTH-03:** System shall issue JWT tokens for API access
- **FR-AUTH-04:** System shall enforce role-based access control
- **FR-AUTH-05:** System shall support password reset via email

#### Module: Products
- **FR-PROD-01:** System shall display product catalog with filtering
- **FR-PROD-02:** System shall support product search by name
- **FR-PROD-03:** System shall display full product details
- **FR-PROD-04:** System shall allow admin CRUD operations on products

#### Module: Cart & Orders
- **FR-CART-01:** System shall maintain per-user shopping carts
- **FR-ORD-01:** System shall process multi-step checkout
- **FR-ORD-02:** System shall create order records in Firestore
- **FR-ORD-03:** System shall track order status lifecycle

#### Module: Chat
- **FR-CHAT-01:** System shall provide real-time messaging via WebSocket
- **FR-CHAT-02:** System shall store conversation history
- **FR-CHAT-03:** System shall support moderator-to-customer communication

### 3.3 Non-Functional Requirements

| Category | Requirement | Specification |
|----------|------------|---------------|
| Performance | Response Time | API < 500ms, Pages < 3s |
| Scalability | Concurrent Users | 500+ simultaneous |
| Security | Data Encryption | HTTPS/TLS 1.2+ |
| Security | Authentication | Firebase JWT verification |
| Reliability | Uptime | 99.5% availability |
| Usability | Mobile Support | Responsive down to 320px |
| Maintainability | Code Quality | Linting, type checking |
| Compatibility | Browser Support | Latest 2 versions of major browsers |

### 3.4 Database Requirements

| Collection | Key Indexes | Retention |
|-----------|------------|-----------|
| users | email (unique), role | Indefinite |
| products | category, price, name | Indefinite |
| orders | userId, status, createdAt | Indefinite |
| carts | userId | Until order placed |
| coupons | code (unique), validUntil | Until expired |
| conversations | customerId, status | Indefinite |
| messages | conversationId, createdAt | Indefinite |

## 4. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  React SPA (Vercel)                          │   │
│  │  ├── Components (Navbar, Footer, Chat)       │   │
│  │  ├── Pages (Home, Products, Cart, Checkout)  │   │
│  │  ├── Context (AuthContext, CartContext)       │   │
│  │  └── Firebase SDK (Auth, Firestore)          │   │
│  └──────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS / WSS
┌───────────────────────┴─────────────────────────────┐
│                    SERVER LAYER                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  FastAPI (Railway/Render)                    │   │
│  │  ├── Routes (auth, products, orders, chat)   │   │
│  │  ├── Models (Pydantic schemas)               │   │
│  │  ├── Middleware (CORS, auth verification)    │   │
│  │  └── Firebase Admin SDK                      │   │
│  └──────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS
┌───────────────────────┴─────────────────────────────┐
│                   DATA LAYER                         │
│  ┌────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Firebase   │  │ Firebase     │  │ Firebase   │  │
│  │ Auth       │  │ Firestore    │  │ Storage    │  │
│  └────────────┘  └──────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 5. Appendices

### 5.1 Technology Versions
| Technology | Version |
|-----------|---------|
| React | 18.x |
| Tailwind CSS | 3.x |
| FastAPI | 0.100+ |
| Python | 3.10+ |
| Firebase | 10.x (Web SDK) |
| Firebase Admin | 12.x (Python) |

### 5.2 References
- Firebase Documentation: https://firebase.google.com/docs
- FastAPI Documentation: https://fastapi.tiangolo.com/
- React Documentation: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/

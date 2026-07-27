# Afsheen Premium Fashion Hub

Premium Ethnic Fashion, Bridal Wear & Luxury Accessories E-commerce Platform. Serving customers since 2020 with 229K+ Facebook followers.

## Tech Stack

- **Frontend:** React.js 18, Tailwind CSS, React Router, Framer Motion
- **Backend:** Python FastAPI, Firebase Admin SDK
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Payment:** bKash, Nagad, Visa, MasterCard, Bank Transfer, COD

## Project Structure

```
Afsheen-Premium-Fashion-Hub/
├── frontend/                   # React.js Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer, Layout
│   │   │   ├── common/         # ProductCard, Modal, LoadingSpinner
│   │   │   ├── home/           # Hero, Categories, Products, Testimonials
│   │   │   ├── cart/           # Cart components
│   │   │   ├── checkout/       # Payment components
│   │   │   ├── chat/           # Live Chat Widget
│   │   │   └── admin/          # Admin dashboard components
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── BookingGuidelines.jsx
│   │   │   ├── ReturnPolicy.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   └── AdminDashboard.jsx
│   │   │   └── moderator/
│   │   │       ├── ModeratorLogin.jsx
│   │   │       └── ModeratorDashboard.jsx
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── firebase/           # Firebase config
│   │   ├── data/               # Product categories, sample data
│   │   └── services/           # API service layer
│   ├── tailwind.config.js      # Luxury theme configuration
│   └── package.json
│
├── backend/                    # FastAPI Backend
│   ├── main.py                 # FastAPI application entry
│   ├── config.py               # Settings & configuration
│   ├── firebase_admin_config.py # Firebase Admin setup
│   ├── models/
│   │   └── schemas.py          # Pydantic models
│   ├── routes/
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── products.py         # Product CRUD endpoints
│   │   ├── orders.py           # Order & coupon endpoints
│   │   └── chat.py             # Chat endpoints (REST + WebSocket)
│   └── requirements.txt
│
└── docs/                       # Documentation
```

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Update .env with your Firebase config
npm start
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Update .env with your Firebase service account path
python -m uvicorn main:app --reload --port 8000
```

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Generate a service account key and place it in `backend/serviceAccountKey.json`
5. Copy Firebase config to `frontend/.env`

## Features

### Customer
- Browse 10+ product categories with high-quality images
- Advanced search, filtering (size, price, stock), and sorting
- Shopping cart with quantity management
- Coupon/voucher discount system
- Multiple payment gateways (bKash, Nagad, Visa, MC, Bank, COD)
- Order tracking and history
- Live chat support
- Booking guidelines and return policy

### Admin
- Dashboard with revenue, orders, products, customers stats
- Product CRUD operations and stock management
- Order status management
- Customer overview

### Moderator
- Live chat dashboard for real-time customer support
- Chat session assignment and management

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| GET | `/api/v1/auth/me` | Get current user profile |
| PUT | `/api/v1/auth/me` | Update user profile |
| GET | `/api/v1/products/` | List products (with filters) |
| GET | `/api/v1/products/{id}` | Get product detail |
| POST | `/api/v1/products/` | Create product (admin) |
| PUT | `/api/v1/products/{id}` | Update product (admin) |
| DELETE | `/api/v1/products/{id}` | Delete product (admin) |
| POST | `/api/v1/orders/` | Create order |
| GET | `/api/v1/orders/` | List user orders |
| GET | `/api/v1/orders/all` | List all orders (admin) |
| PUT | `/api/v1/orders/{id}/status` | Update order status (admin) |
| POST | `/api/v1/orders/coupons` | Create coupon (admin) |
| POST | `/api/v1/orders/coupons/validate` | Validate coupon |
| POST | `/api/v1/chat/sessions` | Create chat session |
| GET | `/api/v1/chat/sessions` | List chat sessions |
| POST | `/api/v1/chat/sessions/{id}/messages` | Send chat message |
| WS | `/api/v1/chat/ws/{session_id}` | WebSocket for real-time chat |

## Demo Credentials

- **Admin:** admin@afsheen.com / admin123
- **Moderator:** mod@afsheen.com / mod123

## Author

Sheikh Jannatul Firdaus Nirjhor

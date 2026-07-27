# 21 - API Design

## 1. Purpose

This document specifies the RESTful API design for the Afsheen Premium Fashion Hub backend, including endpoints, request/response formats, authentication, and error handling.

## 2. Base URL

```
Development:  http://localhost:8000
Production:   https://api.afsheen-fashion.com
```

## 3. API Conventions

### 3.1 Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| Content-Type | Yes | `application/json` |
| Authorization | Protected routes | `Bearer {firebase_id_token}` |

### 3.2 Response Format

**Success:**
```json
{
  "data": { ... },
  "message": "Success message"
}
```

**Error:**
```json
{
  "detail": "Human-readable error message"
}
```

### 3.3 HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 422 | Unprocessable Entity (Pydantic validation) |
| 500 | Internal Server Error |

### 3.4 Authentication

Protected endpoints verify the Firebase ID token from the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6...
```

The token is verified using Firebase Admin SDK. The decoded user information is attached to the request state.

## 4. Authentication Endpoints

### POST `/api/auth/register`

Register a new user account.

**Request:**
```json
{
  "name": "Ayesha Khan",
  "email": "ayesha@example.com",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "data": {
    "uid": "abc123",
    "name": "Ayesha Khan",
    "email": "ayesha@example.com",
    "role": "customer"
  },
  "message": "User registered successfully"
}
```

**Errors:**
| Status | Detail |
|--------|--------|
| 400 | "Email already in use" |
| 422 | Validation error (invalid email, short password) |

---

### POST `/api/auth/login`

Authenticate an existing user.

**Request:**
```json
{
  "email": "ayesha@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "data": {
    "uid": "abc123",
    "name": "Ayesha Khan",
    "email": "ayesha@example.com",
    "role": "customer",
    "token": "eyJhbGciOi..."
  },
  "message": "Login successful"
}
```

**Errors:**
| Status | Detail |
|--------|--------|
| 401 | "Invalid email or password" |

---

### GET `/api/auth/me`

Get the current authenticated user's profile.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "data": {
    "uid": "abc123",
    "name": "Ayesha Khan",
    "email": "ayesha@example.com",
    "phone": "+923001234567",
    "role": "customer",
    "address": {
      "street": "123 Main St",
      "city": "Lahore",
      "state": "Punjab",
      "postalCode": "54000"
    },
    "createdAt": "2026-07-01T10:00:00Z"
  }
}
```

---

### PUT `/api/auth/profile`

Update the current user's profile.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Ayesha Khan Updated",
  "phone": "+923007654321",
  "address": {
    "street": "456 New St",
    "city": "Karachi",
    "state": "Sindh",
    "postalCode": "74000"
  }
}
```

**Response (200):**
```json
{
  "data": { "uid": "abc123", "name": "Ayesha Khan Updated", ... },
  "message": "Profile updated successfully"
}
```

## 5. Product Endpoints

### GET `/api/products`

List all products with optional filtering.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| search | string | Search by name |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| sort | string | "price_asc", "price_desc", "newest" |
| featured | boolean | Only featured products |
| limit | number | Results per page (default: 20) |
| offset | number | Pagination offset |

**Response (200):**
```json
{
  "data": [
    {
      "id": "prod123",
      "name": "Floral Summer Dress",
      "price": 4500,
      "category": "dresses",
      "images": ["https://..."],
      "sizes": ["S", "M", "L"],
      "featured": true
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0
}
```

---

### GET `/api/products/{productId}`

Get a single product's full details.

**Response (200):**
```json
{
  "data": {
    "id": "prod123",
    "name": "Floral Summer Dress",
    "description": "A beautiful floral dress...",
    "price": 4500,
    "category": "dresses",
    "images": ["https://img1", "https://img2"],
    "sizes": ["S", "M", "L", "XL"],
    "stock": { "S": 5, "M": 10, "L": 8, "XL": 3 },
    "featured": true,
    "active": true,
    "createdAt": "2026-07-01T10:00:00Z"
  }
}
```

**Errors:**
| Status | Detail |
|--------|--------|
| 404 | "Product not found" |

---

### POST `/api/products` *(Admin only)*

Create a new product.

**Headers:** `Authorization: Bearer {admin_token}`

**Request:**
```json
{
  "name": "New Collection Dress",
  "description": "Elegant evening dress...",
  "price": 6500,
  "category": "dresses",
  "images": ["https://img1"],
  "sizes": ["XS", "S", "M", "L"],
  "stock": { "XS": 5, "S": 10, "M": 15, "L": 8 },
  "featured": false
}
```

**Response (201):**
```json
{
  "data": { "id": "prod456", ... },
  "message": "Product created successfully"
}
```

---

### PUT `/api/products/{productId}` *(Admin only)*

Update an existing product.

**Response (200):**
```json
{
  "data": { "id": "prod123", ... },
  "message": "Product updated successfully"
}
```

---

### DELETE `/api/products/{productId}` *(Admin only)*

Delete a product.

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

## 6. Order Endpoints

### POST `/api/orders`

Place a new order.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "items": [
    { "productId": "prod123", "size": "M", "quantity": 2 }
  ],
  "address": {
    "name": "Ayesha Khan",
    "phone": "+923001234567",
    "street": "123 Main St",
    "city": "Lahore",
    "state": "Punjab",
    "postalCode": "54000"
  },
  "paymentMethod": "cod",
  "couponCode": "SUMMER20"
}
```

**Response (201):**
```json
{
  "data": {
    "orderId": "ord789",
    "total": 7200,
    "discount": 1800,
    "status": "pending",
    "createdAt": "2026-07-15T14:30:00Z"
  },
  "message": "Order placed successfully"
}
```

**Errors:**
| Status | Detail |
|--------|--------|
| 400 | "Cart is empty" |
| 400 | "Product out of stock" |
| 400 | "Invalid coupon code" |

---

### GET `/api/orders`

Get the current user's order history.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "data": [
    {
      "orderId": "ord789",
      "items": [...],
      "total": 7200,
      "status": "shipped",
      "createdAt": "2026-07-15T14:30:00Z"
    }
  ]
}
```

---

### GET `/api/orders/{orderId}`

Get a specific order's details.

**Response (200):**
```json
{
  "data": {
    "orderId": "ord789",
    "items": [
      {
        "productId": "prod123",
        "name": "Floral Summer Dress",
        "size": "M",
        "quantity": 2,
        "price": 4500
      }
    ],
    "subtotal": 9000,
    "discount": 1800,
    "total": 7200,
    "status": "shipped",
    "address": { ... },
    "paymentMethod": "cod",
    "createdAt": "2026-07-15T14:30:00Z",
    "updatedAt": "2026-07-17T09:00:00Z"
  }
}
```

---

### PUT `/api/orders/{orderId}/status` *(Admin only)*

Update order status.

**Request:**
```json
{
  "status": "shipped"
}
```

**Valid statuses:** `pending` → `processing` → `shipped` → `delivered`

**Response (200):**
```json
{
  "data": { "orderId": "ord789", "status": "shipped" },
  "message": "Order status updated"
}
```

## 7. Coupon Endpoints

### POST `/api/coupons/validate`

Validate a coupon code.

**Request:**
```json
{
  "code": "SUMMER20"
}
```

**Response (200):**
```json
{
  "data": {
    "code": "SUMMER20",
    "discountPercent": 20,
    "validUntil": "2026-08-31T23:59:59Z"
  },
  "message": "Coupon is valid"
}
```

**Errors:**
| Status | Detail |
|--------|--------|
| 404 | "Coupon not found" |
| 400 | "Coupon has expired" |
| 400 | "Coupon usage limit reached" |

---

### POST `/api/coupons` *(Admin only)*

Create a new coupon.

**Request:**
```json
{
  "code": "WELCOME10",
  "discountPercent": 10,
  "validFrom": "2026-07-01T00:00:00Z",
  "validUntil": "2026-12-31T23:59:59Z",
  "usageLimit": 100
}
```

**Response (201):**
```json
{
  "data": { "id": "coup456", "code": "WELCOME10", ... },
  "message": "Coupon created successfully"
}
```

---

### GET `/api/coupons` *(Admin only)*

List all coupons.

---

### DELETE `/api/coupons/{couponId}` *(Admin only)*

Delete a coupon.

## 8. Chat Endpoints

### POST `/api/chat/conversations`

Start a new chat conversation (customer).

**Headers:** `Authorization: Bearer {token}`

**Response (201):**
```json
{
  "data": {
    "conversationId": "conv123",
    "status": "open",
    "createdAt": "2026-07-15T15:00:00Z"
  }
}
```

---

### GET `/api/chat/conversations`

Get conversations (customer: own, moderator: all open).

---

### GET `/api/chat/conversations/{convId}/messages`

Get chat messages for a conversation.

**Response (200):**
```json
{
  "data": [
    {
      "id": "msg1",
      "senderName": "Ayesha",
      "senderRole": "customer",
      "text": "Hi, I need help with my order",
      "createdAt": "2026-07-15T15:01:00Z"
    },
    {
      "id": "msg2",
      "senderName": "Support",
      "senderRole": "moderator",
      "text": "Hello! I'd be happy to help.",
      "createdAt": "2026-07-15T15:02:00Z"
    }
  ]
}
```

---

### WebSocket `/ws/chat/{convId}`

Real-time chat connection.

**Connection:** `ws://localhost:8000/ws/chat/conv123?token={firebase_token}`

**Messages (JSON):**
```json
// Send
{ "type": "message", "text": "Hello!" }

// Receive
{ "type": "message", "sender": "Ayesha", "role": "customer", "text": "Hello!", "timestamp": "..." }

// Typing indicator
{ "type": "typing", "sender": "Support" }
```

---

### PUT `/api/chat/conversations/{convId}/close` *(Moderator)*

Mark a conversation as resolved.

**Response (200):**
```json
{
  "data": { "conversationId": "conv123", "status": "resolved" },
  "message": "Conversation closed"
}
```

## 9. Admin Dashboard Endpoints

### GET `/api/admin/stats` *(Admin only)*

Get dashboard statistics.

**Response (200):**
```json
{
  "data": {
    "totalOrders": 156,
    "totalRevenue": 780000,
    "totalUsers": 342,
    "totalProducts": 48,
    "pendingOrders": 12,
    "recentOrders": [...]
  }
}
```

---

### GET `/api/admin/users` *(Admin only)*

List all registered users.

---

### GET `/api/admin/orders` *(Admin only)*

List all orders with filtering.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by order status |
| limit | number | Results per page |
| offset | number | Pagination offset |

## 10. Error Response Examples

```json
// 400 Bad Request
{ "detail": "Email already in use" }

// 401 Unauthorized
{ "detail": "Not authenticated" }

// 403 Forbidden
{ "detail": "Insufficient permissions" }

// 404 Not Found
{ "detail": "Product not found" }

// 422 Validation Error
{
  "detail": [
    { "loc": ["body", "email"], "msg": "value is not a valid email" },
    { "loc": ["body", "password"], "msg": "ensure this value has at least 8 characters" }
  ]
}

// 500 Internal Server Error
{ "detail": "An unexpected error occurred" }
```

## 11. Rate Limiting

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| Public (GET) | 100 requests | per minute |
| Authenticated | 200 requests | per minute |
| Admin | 500 requests | per minute |
| WebSocket | 1 connection | per user |

## 12. API Versioning

The API uses URL-based versioning:

```
/api/v1/products    (current)
/api/v2/products    (future)
```

Version increments for breaking changes. Minor changes are backward-compatible within a version.

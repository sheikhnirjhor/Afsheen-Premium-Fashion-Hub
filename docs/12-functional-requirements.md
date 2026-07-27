# 12 - Functional Requirements

## 1. Purpose

This document specifies the functional requirements of the Afsheen Premium Fashion Hub — what the system must do to satisfy user needs.

## 2. FR Categories

### 2.1 User Authentication (FR-AUTH)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-AUTH-01 | The system shall allow users to register with email and password | P0 |
| FR-AUTH-02 | The system shall authenticate users via Firebase Authentication | P0 |
| FR-AUTH-03 | The system shall support Google OAuth sign-in | P0 |
| FR-AUTH-04 | The system shall send password reset emails | P1 |
| FR-AUTH-05 | The system shall maintain user sessions until logout | P0 |
| FR-AUTH-06 | The system shall assign roles (Customer, Moderator, Admin) to users | P0 |
| FR-AUTH-07 | The system shall restrict admin routes to admin-role users | P0 |
| FR-AUTH-08 | The system shall restrict moderator routes to moderator/admin roles | P1 |

### 2.2 Product Management (FR-PROD)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-PROD-01 | The system shall display a catalog of all available products | P0 |
| FR-PROD-02 | The system shall allow filtering products by category | P0 |
| FR-PROD-03 | The system shall allow searching products by name | P0 |
| FR-PROD-04 | The system shall support sorting by price (low-high, high-low) | P1 |
| FR-PROD-05 | The system shall display product details: name, description, price, images, sizes, stock | P0 |
| FR-PROD-06 | The system shall allow admins to create new products | P0 |
| FR-PROD-07 | The system shall allow admins to edit existing products | P0 |
| FR-PROD-08 | The system shall allow admins to delete products | P1 |
| FR-PROD-09 | The system shall mark products as out of stock when quantity reaches 0 | P0 |
| FR-PROD-10 | The system shall support multiple product images per product | P1 |

### 2.3 Shopping Cart (FR-CART)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-CART-01 | The system shall allow users to add products to the cart with selected size | P0 |
| FR-CART-02 | The system shall persist cart contents across sessions (logged-in users) | P0 |
| FR-CART-03 | The system shall allow updating item quantities | P0 |
| FR-CART-04 | The system shall allow removing items from the cart | P0 |
| FR-CART-05 | The system shall display a running subtotal and total | P0 |
| FR-CART-06 | The system shall enforce maximum quantity based on stock availability | P0 |
| FR-CART-07 | The system shall display cart item count in the navbar | P0 |

### 2.4 Checkout & Orders (FR-ORD)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-ORD-01 | The system shall provide a multi-step checkout (address → payment → confirmation) | P0 |
| FR-ORD-02 | The system shall collect shipping address with validation | P0 |
| FR-ORD-03 | The system shall support Cash on Delivery as a payment method | P0 |
| FR-ORD-04 | The system shall generate a unique order ID for each order | P0 |
| FR-ORD-05 | The system shall create an order record in Firestore with status "Pending" | P0 |
| FR-ORD-06 | The system shall clear the cart after successful order placement | P0 |
| FR-ORD-07 | The system shall send an order confirmation email | P1 |
| FR-ORD-08 | The system shall allow users to view their order history | P0 |
| FR-ORD-09 | The system shall display order status (Pending, Processing, Shipped, Delivered) | P0 |
| FR-ORD-10 | The system shall allow admins to update order status | P0 |

### 2.5 Coupon System (FR-COUPON)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-COUPON-01 | The system shall allow admins to create coupons with a code and discount percentage | P1 |
| FR-COUPON-02 | The system shall validate coupon codes during checkout | P1 |
| FR-COUPON-03 | The system shall enforce coupon expiry dates | P1 |
| FR-COUPON-04 | The system shall enforce maximum usage limits per coupon | P1 |
| FR-COUPON-05 | The system shall apply the discount to the order total | P1 |

### 2.6 Chat System (FR-CHAT)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-CHAT-01 | The system shall display a chat widget on all customer-facing pages | P1 |
| FR-CHAT-02 | The system shall allow customers to send messages in real-time | P1 |
| FR-CHAT-03 | The system shall support WebSocket connections for real-time messaging | P1 |
| FR-CHAT-04 | The system shall store chat messages in Firestore | P1 |
| FR-CHAT-05 | The system shall allow moderators to view and respond to chats | P1 |
| FR-CHAT-06 | The system shall allow moderators to close resolved conversations | P1 |
| FR-CHAT-07 | The system shall display online/offline status of support agents | P2 |

### 2.7 Admin Dashboard (FR-ADMIN)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-ADMIN-01 | The system shall display a dashboard with total orders, revenue, users, and products | P0 |
| FR-ADMIN-02 | The system shall provide a product management interface (CRUD) | P0 |
| FR-ADMIN-03 | The system shall provide an order management interface | P0 |
| FR-ADMIN-04 | The system shall provide a user management interface | P1 |
| FR-ADMIN-05 | The system shall provide a coupon management interface | P1 |
| FR-ADMIN-06 | The dashboard shall update data in real-time | P1 |

### 2.8 Moderator Dashboard (FR-MOD)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-MOD-01 | The system shall display a list of active chat conversations | P1 |
| FR-MOD-02 | The system shall allow moderators to respond to customer messages | P1 |
| FR-MOD-03 | The system shall show customer order history alongside chat | P2 |
| FR-MOD-04 | The system shall allow marking conversations as resolved | P1 |

## 3. Priority Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 30 | Must be implemented for MVP |
| P1 | 17 | Should be implemented for V1.0 |
| P2 | 3 | Nice to have, can be deferred |
| **Total** | **50** | |

## 4. Data Flow Summary

```
Customer → Frontend (React) → Backend API (FastAPI) → Firebase Firestore
                                    ↓
                              Firebase Auth
                                    ↓
                           Email Service (SMTP)
```

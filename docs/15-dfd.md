# 15 - Data Flow Diagram (DFD)

## 1. Purpose

A Data Flow Diagram (DFD) illustrates how data moves through the Afsheen Premium Fashion Hub system — from user input to storage and back. It shows processes, data stores, external entities, and data flows.

## 2. DFD Level 0 — Context Diagram

The highest-level view showing the system as a single process and its interactions with external entities.

```
┌─────────────┐                                    ┌──────────────────┐
│             │  ── Browse/Search Products ──────> │                  │
│             │  <── Product Details ───────────── │                  │
│             │  ── Add to Cart ─────────────────> │                  │
│  Customer   │  ── Place Order ─────────────────> │   Afsheen Hub    │
│  (Guest/    │  <── Order Confirmation ────────── │   (E-Commerce    │
│  Registered)│  ── Track Order ─────────────────> │    System)       │
│             │  <── Order Status ──────────────── │                  │
│             │  ── Send Chat Message ────────────> │                  │
│             │  <── Chat Response ─────────────── │                  │
└─────────────┘                                    └──────────────────┘
                                                            │
                                                            │
       ┌──────────────────┐                    ┌────────────┴───────────┐
       │                  │ <── Manage Data ── │                        │
       │    Admin         │ ── CRUD Products ─>│   Firebase Services    │
       │                  │ ── Manage Orders ─>│   (Auth + Firestore)   │
       └──────────────────┘                    └────────────────────────┘
       ┌──────────────────┐                    ┌────────────────────────┐
       │                  │ <── View Chats ─── │                        │
       │   Moderator      │ ── Respond ───────>│                        │
       └──────────────────┘                    └────────────────────────┘
```

## 3. DFD Level 1 — Major Processes

Breaks the system into its main functional areas.

### Process 1.0: User Authentication

```
                    ┌──────────┐
    Email/Google ──>│ 1.0      │──> Auth Token ──> Client
    Credentials     │ Authenticate│
                    │ User     │──> User Profile ──> Firestore
                    └──────────┘
                         │
                    ┌────┴─────┐
                    │ Firebase │
                    │  Auth    │
                    └──────────┘
```

**Data In:** Email/password, Google OAuth token
**Data Out:** JWT token, user profile
**Data Store:** Firebase Auth, Firestore (users collection)

---

### Process 2.0: Product Management

```
  Admin ──> ┌──────────┐ ──> Product Data ──> Firestore
            │ 2.0      │
 Customer ─>│ Manage   │ <── Product Data ──< Firestore
            │ Products │
            └──────────┘
                 │
            Product Listing ──> Customer
```

**Data In:** Product details (name, price, images, category, sizes)
**Data Out:** Product listing, product details
**Data Store:** Firestore (products collection)

---

### Process 3.0: Shopping Cart

```
  Customer ──> ┌──────────┐ ──> Cart Data ──> Firestore
               │ 3.0      │
  Customer ──> │ Manage   │ <── Cart Data ──< Firestore
               │ Cart     │
               └──────────┘
                    │
               Cart Summary ──> Customer
```

**Data In:** Product ID, size, quantity
**Data Out:** Cart contents, subtotal, total
**Data Store:** Firestore (carts collection)

---

### Process 4.0: Order Processing

```
  Cart Data ──> ┌──────────┐ ──> Order Record ──> Firestore
  Address ────> │ 4.0      │ ──> Order ID ──> Customer
  Payment ────> │ Process  │ ──> Confirmation Email ──> Email Service
                │ Order    │ ──> Stock Update ──> Firestore
                └──────────┘
```

**Data In:** Cart items, shipping address, payment method
**Data Out:** Order confirmation, order ID, email
**Data Store:** Firestore (orders collection, products stock)

---

### Process 5.0: Chat Communication

```
  Customer Message ──> ┌──────────┐ ──> Message ──> Firestore
                       │ 5.0      │ ──> Real-time ──> Moderator
  Moderator Reply ───> │ Handle   │ ──> Real-time ──> Customer
                       │ Chat     │ ──> Message ──> Firestore
                       └──────────┘
```

**Data In:** Chat message, sender ID, conversation ID
**Data Out:** Real-time message delivery, chat history
**Data Store:** Firestore (conversations, messages collections)

---

### Process 6.0: Coupon Management

```
  Admin ──> ┌──────────┐ ──> Coupon Data ──> Firestore
            │ 6.0      │
 Customer ─>│ Validate │ <── Coupon Data ──< Firestore
  (Code)    │ Coupon   │
            └──────────┘
                 │
            Discount ──> Customer (checkout)
```

**Data In:** Coupon code, discount %, validity dates
**Data Out:** Validation result, discount amount
**Data Store:** Firestore (coupons collection)

## 4. DFD Level 2 — Detailed Data Flows

### 4.1 Checkout Flow Detail

```
┌────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Cart   │───>│ Validate │───>│ Calculate│───>│ Create   │───>│ Clear    │
│ Items  │    │ Stock    │    │ Total    │    │ Order    │    │ Cart     │
└────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
                    │               │               │               │
               Stock Check    Apply Coupon    Firestore Write  Cart Delete
                    │               │               │               │
              [out of stock]  [discount amt]  [order record]  [empty cart]
```

### 4.2 Authentication Flow Detail

```
┌────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Login  │───>│ Firebase │───>│ Verify   │───>│ Generate │───> JWT Token
│ Form   │    │ Auth     │    │ Credentials│   │ Session  │
└────────┘    └──────────┘    └──────────┘    └──────────┘
                    │               │               │
              Auth Request    Success/Fail    Token + Profile
```

## 5. Data Store Summary

| Data Store | Collection | Key Fields |
|-----------|-----------|------------|
| Users | `users` | id, name, email, phone, role, address, createdAt |
| Products | `products` | id, name, description, price, category, images, sizes, stock |
| Orders | `orders` | id, userId, items, total, status, address, paymentMethod, createdAt |
| Carts | `carts` | userId, items[], total, updatedAt |
| Coupons | `coupons` | id, code, discountPercent, validFrom, validUntil, usageLimit, usedCount |
| Conversations | `conversations` | id, customerId, status, createdAt, updatedAt |
| Messages | `messages` | id, conversationId, senderId, senderRole, text, createdAt |

## 6. External Interfaces

| Interface | Direction | Protocol | Purpose |
|-----------|----------|----------|---------|
| Firebase Auth | Bidirectional | HTTPS | User authentication |
| Firebase Firestore | Bidirectional | HTTPS | Data storage and retrieval |
| Firebase Storage | Bidirectional | HTTPS | Product image storage |
| Email Service | Outbound | SMTP | Order confirmations, password resets |
| WebSocket | Bidirectional | WSS | Real-time chat |

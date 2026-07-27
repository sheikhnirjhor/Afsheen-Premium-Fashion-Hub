# 17 - Entity Relationship Diagram (ERD)

## 1. Purpose

This document defines the data entities, their attributes, and relationships in the Afsheen Premium Fashion Hub database (Firebase Firestore).

## 2. Firestore Collections Overview

Firestore is a NoSQL document database. Data is organized into collections, each containing documents with fields.

```
firestore/
├── users/           (collection)
│   └── {userId}/    (document)
├── products/        (collection)
│   └── {productId}/ (document)
├── orders/          (collection)
│   └── {orderId}/   (document)
├── carts/           (collection)
│   └── {userId}/    (document)
├── coupons/         (collection)
│   └── {couponId}/  (document)
├── conversations/   (collection)
│   └── {convId}/    (document)
│       └── messages/ (subcollection)
│           └── {msgId}/
```

## 3. Entity Definitions

### 3.1 User Entity

```
┌─────────────────────────────────────────────┐
│                  users                       │
├─────────────────────────────────────────────┤
│ id            │ string   │ (document ID)    │
│ name          │ string   │ Full name        │
│ email         │ string   │ Unique, indexed  │
│ phone         │ string   │ Optional         │
│ role          │ string   │ customer|admin|moderator │
│ address       │ map      │ {street, city,   │
│               │          │  state, postal}  │
│ profileImage  │ string   │ URL (optional)   │
│ createdAt     │ timestamp│ Account creation │
│ updatedAt     │ timestamp│ Last update      │
└─────────────────────────────────────────────┘
```

### 3.2 Product Entity

```
┌─────────────────────────────────────────────┐
│                products                      │
├─────────────────────────────────────────────┤
│ id            │ string   │ (document ID)    │
│ name          │ string   │ Product name     │
│ description   │ string   │ Full description │
│ price         │ number   │ Price in PKR     │
│ category      │ string   │ Category name    │
│ images        │ array    │ [url1, url2, ...]│
│ sizes         │ array    │ ["S","M","L","XL"]│
│ stock         │ map      │ {"S":10, "M":5}  │
│ featured      │ boolean  │ Show on homepage │
│ active        │ boolean  │ Currently selling│
│ createdAt     │ timestamp│ Creation date    │
│ updatedAt     │ timestamp│ Last modified    │
└─────────────────────────────────────────────┘
```

### 3.3 Order Entity

```
┌─────────────────────────────────────────────┐
│                  orders                       │
├─────────────────────────────────────────────┤
│ id            │ string   │ (document ID)    │
│ userId        │ string   │ Reference→users  │
│ items         │ array    │ [{productId,     │
│               │          │  name, size,     │
│               │          │  quantity, price}]│
│ subtotal      │ number   │ Sum before disc. │
│ discount      │ number   │ Coupon discount  │
│ total         │ number   │ Final amount     │
│ couponCode    │ string   │ Applied coupon   │
│ status        │ string   │ pending|processing│
│               │          │ |shipped|delivered│
│ address       │ map      │ {name, phone,    │
│               │          │  street, city,   │
│               │          │  state, postal}  │
│ paymentMethod │ string   │ cod|card|...     │
│ createdAt     │ timestamp│ Order date       │
│ updatedAt     │ timestamp│ Status change    │
└─────────────────────────────────────────────┘
```

### 3.4 Cart Entity

```
┌─────────────────────────────────────────────┐
│                   carts                       │
├─────────────────────────────────────────────┤
│ userId        │ string   │ Document ID =    │
│               │          │ user's ID        │
│ items         │ array    │ [{productId,     │
│               │          │  name, size,     │
│               │          │  quantity, price, │
│               │          │  image}]         │
│ total         │ number   │ Cart subtotal    │
│ couponCode    │ string   │ Applied coupon   │
│ updatedAt     │ timestamp│ Last modification│
└─────────────────────────────────────────────┘
```

### 3.5 Coupon Entity

```
┌─────────────────────────────────────────────┐
│                 coupons                       │
├─────────────────────────────────────────────┤
│ id            │ string   │ (document ID)    │
│ code          │ string   │ Unique, indexed  │
│ discountPercent│ number  │ 5-50 (%)         │
│ validFrom     │ timestamp│ Start date       │
│ validUntil    │ timestamp│ Expiry date      │
│ usageLimit    │ number   │ Max uses total   │
│ usedCount     │ number   │ Current uses     │
│ active        │ boolean  │ Currently valid  │
│ createdAt     │ timestamp│ Creation date    │
└─────────────────────────────────────────────┘
```

### 3.6 Conversation Entity

```
┌─────────────────────────────────────────────┐
│              conversations                    │
├─────────────────────────────────────────────┤
│ id            │ string   │ (document ID)    │
│ customerId    │ string   │ Reference→users  │
│ customerName  │ string   │ Display name     │
│ status        │ string   │ open|resolved    │
│ lastMessage   │ string   │ Preview text     │
│ lastSender    │ string   │ customer|moderator│
│ createdAt     │ timestamp│ Start time       │
│ updatedAt     │ timestamp│ Last message     │
└─────────────────────────────────────────────┘
```

### 3.7 Message Subcollection

```
┌─────────────────────────────────────────────┐
│     conversations/{convId}/messages/         │
├─────────────────────────────────────────────┤
│ id            │ string   │ (document ID)    │
│ senderId      │ string   │ Reference→users  │
│ senderRole    │ string   │ customer|moderator│
│ text          │ string   │ Message content  │
│ read          │ boolean  │ Read by recipient│
│ createdAt     │ timestamp│ Send time        │
└─────────────────────────────────────────────┘
```

## 4. Entity Relationships

```
┌───────┐         ┌──────────┐         ┌─────────┐
│ users │◄────────│  orders   │────────►│ products│
│       │  1:M    │          │  M:M    │         │
│       │         └──────────┘         └─────────┘
│       │◄────┐
│       │ 1:1 │
│       ├─────┘
│       │◄────┐
│       │ 1:1 │
│       ├─────┘         ┌───────────┐
│       │               │  coupons   │
│       │◄──────────────│           │ (via couponCode)
│       │  referenced   └───────────┘
│       │
│       │◄────────┐
│       │  1:M    │    ┌──────────────┐
│       ├─────────┘    │conversations │
│       │              │              │
│       │              │  ┌────────┐  │
│       │              │  │messages│  │
│       │              │  │(sub)   │  │
│       │              │  └────────┘  │
└───────┘              └──────────────┘
```

## 5. Relationship Summary

| Relationship | Type | Description |
|-------------|------|-------------|
| User → Orders | 1:M | One user can have many orders |
| Order → Products | M:M | One order contains many products; one product appears in many orders |
| User → Cart | 1:1 | Each user has one cart |
| Order → Coupon | M:1 | Each order uses zero or one coupon |
| User → Conversations | 1:M | One user can start many conversations |
| Conversation → Messages | 1:M | One conversation contains many messages |

## 6. Indexes

| Collection | Field(s) | Purpose |
|-----------|----------|---------|
| products | category | Filter by category |
| products | price | Sort by price |
| products | name | Search by name |
| orders | userId | Fetch user's orders |
| orders | status | Filter by status |
| orders | createdAt | Sort by date |
| coupons | code | Validate coupon codes |
| conversations | customerId | Fetch user's conversations |
| conversations | status | Filter open conversations |
| messages | conversationId | Fetch conversation messages |
| messages | createdAt | Sort messages chronologically |

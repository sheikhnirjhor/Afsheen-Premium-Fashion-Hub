# 20 - Database Design

## 1. Purpose

This document provides the detailed database design for the Afsheen Premium Fashion Hub, including collection structure, field specifications, security rules, and indexing strategy.

## 2. Database Technology

| Property | Value |
|----------|-------|
| Database | Firebase Firestore |
| Type | NoSQL Document Database |
| Structure | Collections → Documents → Fields |
| Real-time | Supported (onSnapshot listeners) |
| Scaling | Auto-scaling (serverless) |

## 3. Collection Schemas

### 3.1 `users` Collection

```
Document ID: {auto-generated or Firebase Auth UID}

{
  "id":           "string"   // Firebase Auth UID
  "name":         "string"   // Full name (e.g., "Ayesha Khan")
  "email":        "string"   // Unique email address
  "phone":        "string"   // Optional phone number
  "role":         "string"   // "customer" | "admin" | "moderator"
  "address": {
    "street":     "string"   // Street address
    "city":       "string"   // City name
    "state":      "string"   // State/Province
    "postalCode": "string"   // Postal/ZIP code
    "country":    "string"   // Default: "Pakistan"
  },
  "profileImage": "string"   // URL to profile image (optional)
  "createdAt":    "timestamp" // Account creation date
  "updatedAt":    "timestamp" // Last profile update
}
```

**Indexes:**
| Field | Type | Purpose |
|-------|------|---------|
| email | Unique | Login, duplicate check |
| role | Standard | Admin/moderator queries |

---

### 3.2 `products` Collection

```
Document ID: {auto-generated}

{
  "id":          "string"   // Document ID
  "name":        "string"   // Product name
  "description": "string"   // Full product description
  "price":       "number"   // Price in PKR (e.g., 4500)
  "category":    "string"   // "dresses" | "tops" | "bottoms" | "accessories"
  "images":      ["string"] // Array of image URLs
  "sizes":       ["string"] // ["XS", "S", "M", "L", "XL"]
  "stock": {
    "XS":        "number",  // Quantity available per size
    "S":         "number",
    "M":         "number",
    "L":         "number",
    "XL":        "number"
  },
  "featured":    "boolean"  // Show on homepage featured section
  "active":      "boolean"  // Currently available for purchase
  "createdAt":   "timestamp"
  "updatedAt":   "timestamp"
}
```

**Indexes:**
| Field | Type | Purpose |
|-------|------|---------|
| category | Standard | Filter by category |
| price | Standard | Sort/filter by price |
| name | Standard | Search by name |
| featured | Standard | Homepage featured products |
| active | Standard | Show only active products |

---

### 3.3 `orders` Collection

```
Document ID: {auto-generated}

{
  "id":            "string"   // Document ID
  "userId":        "string"   // Reference to users collection
  "items": [
    {
      "productId": "string"  // Reference to products collection
      "name":      "string"  // Product name (denormalized)
      "size":      "string"  // Selected size
      "quantity":  "number"  // Quantity ordered
      "price":     "number"  // Price at time of order
      "image":     "string"  // Primary image URL (denormalized)
    }
  ],
  "subtotal":      "number"  // Sum of item prices before discount
  "discount":      "number"  // Coupon discount amount
  "total":         "number"  // Final amount after discount
  "couponCode":    "string"  // Applied coupon code (if any)
  "status":        "string"  // "pending" | "processing" | "shipped" | "delivered"
  "address": {
    "name":        "string"  // Recipient name
    "phone":       "string"  // Contact phone
    "street":      "string"  // Street address
    "city":        "string"  // City
    "state":       "string"  // State/Province
    "postalCode":  "string"  // Postal code
    "country":     "string"  // Country
  },
  "paymentMethod": "string"  // "cod" | "card" | "jazzcash" | "easypaisa"
  "createdAt":     "timestamp"
  "updatedAt":     "timestamp"
}
```

**Status Lifecycle:**
```
pending → processing → shipped → delivered
```

**Indexes:**
| Field | Type | Purpose |
|-------|------|---------|
| userId | Standard | Fetch user's orders |
| status | Standard | Filter by status (admin) |
| createdAt | Standard | Sort by date |
| couponCode | Standard | Coupon usage tracking |

---

### 3.4 `carts` Collection

```
Document ID: {userId}  // Same as the user's ID

{
  "userId":     "string"   // Owner's user ID
  "items": [
    {
      "productId": "string"
      "name":      "string"
      "size":      "string"
      "quantity":  "number"
      "price":     "number"
      "image":     "string"
    }
  ],
  "total":      "number"   // Cart subtotal
  "couponCode": "string"   // Applied coupon (optional)
  "updatedAt":  "timestamp"
}
```

---

### 3.5 `coupons` Collection

```
Document ID: {auto-generated}

{
  "id":              "string"   // Document ID
  "code":            "string"   // Unique coupon code (uppercase)
  "discountPercent": "number"   // Discount percentage (5-50)
  "validFrom":       "timestamp" // Start date
  "validUntil":      "timestamp" // Expiry date
  "usageLimit":      "number"   // Maximum total uses
  "usedCount":       "number"   // Current number of uses
  "active":          "boolean"  // Currently valid
  "createdAt":       "timestamp"
}
```

**Indexes:**
| Field | Type | Purpose |
|-------|------|---------|
| code | Unique | Validate coupon at checkout |
| active | Standard | Filter active coupons |
| validUntil | Standard | Expire old coupons |

---

### 3.6 `conversations` Collection

```
Document ID: {auto-generated}

{
  "id":           "string"   // Document ID
  "customerId":   "string"   // Reference to users collection
  "customerName": "string"   // Customer display name
  "status":       "string"   // "open" | "resolved"
  "lastMessage":  "string"   // Preview of last message
  "lastSender":   "string"   // "customer" | "moderator"
  "createdAt":    "timestamp"
  "updatedAt":    "timestamp"
}
```

---

### 3.7 `messages` Subcollection

```
Path: conversations/{convId}/messages/{msgId}
Document ID: {auto-generated}

{
  "id":             "string"   // Document ID
  "senderId":       "string"   // Reference to users collection
  "senderName":     "string"   // Sender display name
  "senderRole":     "string"   // "customer" | "moderator"
  "text":           "string"   // Message content
  "read":           "boolean"  // Read by recipient
  "createdAt":      "timestamp"
}
```

## 4. Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: only authenticated users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Products: anyone can read, only admins can write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Orders: users can read their own, admins can read all
    match /orders/{orderId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
      allow create: if request.auth != null;
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Carts: users can read/write their own cart
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Coupons: anyone can read, only admins can write
    match /coupons/{couponId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Conversations & Messages
    match /conversations/{convId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      match /messages/{msgId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }
  }
}
```

## 5. Data Retention Policy

| Collection | Retention | Cleanup Strategy |
|-----------|-----------|-----------------|
| users | Indefinite | Manual deletion on request |
| products | Indefinite | Soft delete (active=false) |
| orders | Indefinite | Archive after 2 years |
| carts | Until order placed | Auto-delete on checkout |
| coupons | Until expired | Manual cleanup quarterly |
| conversations | Indefinite | Archive resolved > 6 months |
| messages | Indefinite | Cascade delete with conversation |

## 6. Backup Strategy

| Method | Frequency | Scope |
|--------|-----------|-------|
| Firebase automatic backup | Daily | Full database |
| Firestore export (GCS) | Weekly | Full database |
| Order data export | Monthly | Orders collection |
| Manual snapshot | Before major changes | Affected collections |

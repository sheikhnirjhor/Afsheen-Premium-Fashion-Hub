# Firestore Database Schema - Afsheen Premium Fashion Hub

## Collections & Document Structure

### 1. `users` Collection
```
users/{userId} {
  email: string,
  displayName: string,
  phone: string,
  role: "customer" | "admin" | "moderator",
  address: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2. `products` Collection
```
products/{productId} {
  name: string,
  category: string,          // e.g., "bridal-outfit", "saree", "lehenga"
  price: number,
  originalPrice: number | null,
  description: string,
  sizes: string[],           // ["S", "M", "L", "XL", "Custom"]
  colors: string[],          // ["Red", "Maroon"]
  images: string[],          // URLs to images
  stock: number,
  rating: number,            // 0.0 - 5.0
  reviews: number,
  tags: string[],            // ["bestseller", "bridal"]
  featured: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes:**
- category (ascending)
- featured (ascending)
- price (ascending)
- stock (ascending)
- category + price (compound)

### 3. `orders` Collection
```
orders/{orderId} {
  userId: string,            // Reference to users collection
  items: array<{
    productId: string,
    name: string,
    price: number,
    quantity: number,
    size: string,
    color: string
  }>,
  shippingAddress: {
    fullName: string,
    phone: string,
    email: string,
    address: string,
    city: string,
    district: string,
  },
  paymentMethod: "bkash" | "nagad" | "visa" | "mastercard" | "bank" | "cod",
  couponCode: string | null,
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled",
  subtotal: number,
  discount: number,
  shipping: number,
  total: number,
  note: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes:**
- userId (ascending)
- status (ascending)
- createdAt (descending)
- userId + createdAt (compound)

### 4. `coupons` Collection
```
coupons/{couponCode} {
  code: string,
  discount: number,
  type: "percent" | "fixed",
  maxDiscount: number | null,
  minOrder: number,
  active: boolean,
  usageLimit: number | null,
  usedCount: number,
  createdAt: timestamp,
  expiresAt: timestamp | null
}
```

### 5. `chat_sessions` Collection
```
chat_sessions/{sessionId} {
  customerId: string,
  customerName: string,
  agentId: string | null,
  status: "active" | "closed",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 6. `chat_sessions/{sessionId}/messages` Subcollection
```
chat_sessions/{sessionId}/messages/{messageId} {
  sender: "customer" | "agent" | "bot",
  text: string,
  timestamp: timestamp
}
```

### 7. `categories` Collection
```
categories/{categoryId} {
  id: string,
  name: string,
  icon: string,
  image: string,
  description: string,
  order: number,
  active: boolean
}
```

### 8. `settings` Collection (Singleton)
```
settings/store {
  storeName: string,
  phone: string,
  email: string,
  address: string,
  socialMedia: {
    facebook: string,
    instagram: string,
    youtube: string
  },
  shipping: {
    freeDeliveryThreshold: number,
    defaultShippingCost: number
  },
  updatedAt: timestamp
}
```

## Security Rules Summary

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/update their own profile
    match /users/{userId} {
      allow read, update: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
      allow delete: if false;
    }

    // Products are publicly readable
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Orders - users can read their own, admin can read all
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'moderator']
      );
      allow create: if request.auth != null;
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'moderator'];
    }

    // Chat sessions
    match /chat_sessions/{sessionId} {
      allow read: if request.auth != null && (
        resource.data.customerId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'moderator']
      );
      allow create: if request.auth != null;
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'moderator'];

      match /messages/{messageId} {
        allow read, create: if request.auth != null;
      }
    }

    // Coupons are admin-only
    match /coupons/{couponCode} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

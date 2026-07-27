# 14 - Use Cases

## 1. Purpose

Use cases describe how actors (users or external systems) interact with the Afsheen Premium Fashion Hub to achieve specific goals.

## 2. Actors

| Actor | Description |
|-------|-------------|
| Guest | Unregistered visitor browsing the site |
| Customer | Registered user who can purchase and track orders |
| Admin | Full-access administrator managing the platform |
| Moderator | Support staff handling customer conversations |
| Firebase Auth | External authentication service |
| Firebase Firestore | External database service |

## 3. Use Case Diagram Summary

```
┌──────────────────────────────────────────────────────────┐
│                   Afsheen Fashion Hub                     │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │ Browse   │  │ Add to   │  │ Checkout │  │ Track    ││
│  │ Products │  │ Cart     │  │ & Pay    │  │ Order    ││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘│
│       │             │             │             │       │
│  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐│
│  │ Search   │  │ Apply    │  │ Send     │  │ Manage   ││
│  │ Products │  │ Coupon   │  │ Chat Msg │  │ Products ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
└──────────────────────────────────────────────────────────┘
         │              │             │             │
    ┌────┴────┐    ┌────┴────┐   ┌────┴────┐   ┌────┴────┐
    │  Guest  │    │Customer │   │Moderator│   │  Admin  │
    └─────────┘    └─────────┘   └─────────┘   └─────────┘
```

## 4. Detailed Use Cases

### UC-01: Browse Product Catalog

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-01 |
| **Name** | Browse Product Catalog |
| **Actor** | Guest, Customer |
| **Precondition** | User has access to the website |
| **Postcondition** | Products are displayed to the user |
| **Priority** | High |

**Main Flow:**
1. User navigates to the homepage
2. System displays featured products and categories
3. User clicks on a category
4. System filters and displays products in that category
5. User scrolls through the product listing
6. System loads more products (lazy loading/pagination)

**Alternative Flows:**
- 3a. User uses search bar instead of category → System filters by search query
- 5a. No products in category → System shows "No products found"

---

### UC-02: View Product Details

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-02 |
| **Name** | View Product Details |
| **Actor** | Guest, Customer |
| **Precondition** | Product exists in the catalog |
| **Postcondition** | Product details are displayed |
| **Priority** | High |

**Main Flow:**
1. User clicks on a product card
2. System loads the product detail page
3. System displays: name, description, price, images, available sizes
4. User clicks on an image to zoom
5. System shows enlarged image view
6. User clicks "Size Guide"
7. System displays size chart modal

**Alternative Flows:**
- 4a. Only one image available → Zoom not available
- 7a. Size guide not applicable (accessories) → Size guide button hidden

---

### UC-03: Add Product to Cart

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-03 |
| **Name** | Add Product to Cart |
| **Actor** | Guest, Customer |
| **Precondition** | User is on a product detail page, product is in stock |
| **Postcondition** | Product is added to the cart |
| **Priority** | High |

**Main Flow:**
1. User selects a size from available options
2. User clicks "Add to Cart"
3. System validates size selection
4. System adds the item to the cart
5. System shows a success animation/toast
6. System updates the cart icon count in the navbar

**Alternative Flows:**
- 1a. No size selected → System shows error "Please select a size"
- 3a. Selected size is out of stock → System shows "Out of Stock" for that size
- 3b. Item already in cart → System updates quantity instead of adding duplicate

---

### UC-04: Apply Coupon Code

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-04 |
| **Name** | Apply Coupon Code |
| **Actor** | Customer |
| **Precondition** | User has items in cart, on checkout page |
| **Postcondition** | Discount is applied to order total |
| **Priority** | Medium |

**Main Flow:**
1. User enters a coupon code in the input field
2. User clicks "Apply"
3. System validates the coupon code against Firestore
4. System verifies: code exists, is not expired, usage limit not reached
5. System applies the discount percentage to the subtotal
6. System updates the order total with the discounted amount
7. System shows "Coupon applied successfully" message

**Alternative Flows:**
- 3a. Coupon code doesn't exist → System shows "Invalid coupon code"
- 3b. Coupon is expired → System shows "This coupon has expired"
- 3c. Usage limit reached → System shows "This coupon has been fully used"

---

### UC-05: Place Order

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-05 |
| **Name** | Place Order |
| **Actor** | Customer |
| **Precondition** | User has items in cart, is logged in |
| **Postcondition** | Order is created, cart is cleared, confirmation shown |
| **Priority** | High |

**Main Flow:**
1. User clicks "Proceed to Checkout"
2. System displays Step 1: Shipping Address form
3. User fills in name, phone, address, city, postal code
4. System validates the form fields
5. User clicks "Continue to Payment"
6. System displays Step 2: Payment Method selection
7. User selects "Cash on Delivery"
8. User reviews order summary
9. User clicks "Place Order"
10. System creates order in Firestore (status: Pending)
11. System clears the cart
12. System displays order confirmation with order ID
13. System sends confirmation email

**Alternative Flows:**
- 4a. Validation fails → System highlights errors, user corrects
- 10a. Stock becomes unavailable → System shows "Item no longer available"

---

### UC-06: Track Order

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-06 |
| **Name** | Track Order |
| **Actor** | Customer |
| **Precondition** | User is logged in, has at least one order |
| **Postcondition** | Order status is displayed |
| **Priority** | High |

**Main Flow:**
1. User navigates to "My Orders" page
2. System retrieves and displays all user orders
3. User clicks on a specific order
4. System displays order details: items, total, status, timeline
5. System shows current status (Pending / Processing / Shipped / Delivered)

---

### UC-07: Manage Products (Admin)

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-07 |
| **Name** | Manage Products |
| **Actor** | Admin |
| **Precondition** | Admin is authenticated with admin role |
| **Postcondition** | Product catalog is updated |
| **Priority** | High |

**Main Flow:**
1. Admin navigates to Admin Dashboard → Products section
2. System displays all products in a table/grid
3. Admin clicks "Add New Product"
4. System shows product creation form
5. Admin fills: name, description, price, category, sizes, stock, images
6. Admin clicks "Save"
7. System validates the form
8. System creates the product in Firestore
9. Product appears in the customer-facing catalog

**Alternative Flows:**
- 3a. Admin clicks "Edit" on existing product → Pre-filled form shown
- 3b. Admin clicks "Delete" → Confirmation dialog → Product removed

---

### UC-08: Manage Chat (Moderator)

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-08 |
| **Name** | Manage Chat Conversations |
| **Actor** | Moderator |
| **Precondition** | Moderator is authenticated |
| **Postcondition** | Customer query is addressed |
| **Priority** | Medium |

**Main Flow:**
1. Moderator navigates to Moderator Dashboard
2. System displays list of active conversations
3. Moderator clicks on a conversation
4. System loads chat history alongside customer info
5. Moderator reads the customer's message
6. Moderator types and sends a response
7. Customer receives the message in real-time
8. Moderator marks the conversation as "Resolved"

**Alternative Flows:**
- 5a. Customer has pending orders → System shows order history panel
- 8a. Issue requires escalation → Moderator flags for admin review

---

## 5. Use Case Traceability Matrix

| Use Case | User Story | Functional Requirement |
|----------|-----------|----------------------|
| UC-01 | US-05, US-06, US-08, US-09 | FR-PROD-01 to FR-PROD-05 |
| UC-02 | US-07 | FR-PROD-05, FR-PROD-10 |
| UC-03 | US-10, US-11, US-12 | FR-CART-01 to FR-CART-07 |
| UC-04 | US-13 | FR-COUPON-01 to FR-COUPON-05 |
| UC-05 | US-15, US-16 | FR-ORD-01 to FR-ORD-07 |
| UC-06 | US-17, US-18, US-19 | FR-ORD-08, FR-ORD-09 |
| UC-07 | US-24 to US-29 | FR-ADMIN-01 to FR-ADMIN-06 |
| UC-08 | US-30 to US-33 | FR-MOD-01 to FR-MOD-04 |

# 10 - User Stories

## 1. Purpose

User stories capture requirements from the end-user's perspective using the format: **"As a [role], I want [goal] so that [benefit]."**

## 2. Customer Stories

### Authentication & Account

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-01 | As a customer, I want to register with my email and password so that I can create an account | P0 | Email validation, password min 8 chars, confirmation email sent |
| US-02 | As a customer, I want to log in with Google so that I don't need to create a new password | P0 | Google OAuth flow, auto-create account on first login |
| US-03 | As a customer, I want to reset my forgotten password so that I can regain access to my account | P1 | Password reset email sent within 30 seconds, link valid for 24 hours |
| US-04 | As a customer, I want to log out so that my account is secure on shared devices | P0 | Session cleared, redirected to homepage |

### Product Browsing

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-05 | As a customer, I want to browse products by category so that I can find what I'm looking for | P0 | Categories displayed, filtering works, URL updates |
| US-06 | As a customer, I want to search for products by name so that I can find specific items | P0 | Search results appear within 500ms, shows matching products |
| US-07 | As a customer, I want to view product details (images, price, description, sizes) so that I can make an informed decision | P0 | All fields displayed, images zoomable, size guide accessible |
| US-08 | As a customer, I want to filter products by price range so that I stay within my budget | P1 | Price slider works, products update in real-time |
| US-09 | As a customer, I want to sort products by price/popularity/newest so that I can find the best options | P1 | Sort dropdown functional, products reorder correctly |

### Shopping Cart & Checkout

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-10 | As a customer, I want to add products to my cart so that I can purchase multiple items | P0 | Cart icon shows item count, product added with correct size/qty |
| US-11 | As a customer, I want to update quantities in my cart so that I can adjust my order | P0 | Quantity updates, subtotal recalculates, stock limits enforced |
| US-12 | As a customer, I want to remove items from my cart so that I can change my mind | P0 | Item removed, cart updates, empty cart message shown |
| US-13 | As a customer, I want to apply a coupon code so that I get a discount | P1 | Valid coupon applies discount, invalid shows error, total updates |
| US-14 | As a customer, I want to checkout as a guest so that I don't need to register | P2 | Guest checkout available, email required for order confirmation |
| US-15 | As a customer, I want to enter my shipping address so that my order is delivered correctly | P0 | Address form with validation, saved for future orders |
| US-16 | As a customer, I want to select a payment method (COD) so that I can pay conveniently | P0 | COD option available, order placed successfully |

### Order Management

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-17 | As a customer, I want to view my order history so that I can see past purchases | P0 | List of all orders with status, date, total |
| US-18 | As a customer, I want to track my order status so that I know when it will arrive | P0 | Real-time status updates (Processing, Shipped, Delivered) |
| US-19 | As a customer, I want to receive order confirmation via email so that I have a record | P0 | Email sent within 1 minute of order placement |

### Support

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-20 | As a customer, I want to open a chat widget so that I can ask questions | P1 | Chat widget visible on all pages, opens on click |
| US-21 | As a customer, I want to send messages in real-time so that I get quick responses | P1 | Messages appear instantly, connection stable |
| US-22 | As a customer, I want to view my chat history so that I can reference past conversations | P2 | Previous messages loaded when chat opens |

## 3. Admin Stories

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-23 | As an admin, I want to view dashboard statistics so that I can monitor business performance | P0 | Shows total orders, revenue, users, products |
| US-24 | As an admin, I want to add new products so that customers can purchase them | P0 | Form with name, description, price, images, category, sizes |
| US-25 | As an admin, I want to edit existing products so that I can update information | P0 | Pre-filled form, changes saved, reflected immediately |
| US-26 | As an admin, I want to delete products so that I can remove discontinued items | P1 | Confirmation dialog, product removed from catalog |
| US-27 | As an admin, I want to view and manage all orders so that I can process them efficiently | P0 | Order list with filters, status update capability |
| US-28 | As an admin, I want to create and manage coupons so that I can run promotions | P1 | CRUD for coupons with code, discount %, validity, usage limits |
| US-29 | As an admin, I want to view registered users so that I can manage the user base | P1 | User list with roles, search, and filter |

## 4. Moderator Stories

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-30 | As a moderator, I want to view pending chat conversations so that I can respond to customers | P1 | List of open chats with customer name and last message |
| US-31 | As a moderator, I want to respond to customer messages so that I can resolve issues | P1 | Message input, send, real-time delivery |
| US-32 | As a moderator, I want to close resolved conversations so that my queue stays clean | P1 | Close button, conversation marked as resolved |
| US-33 | As a moderator, I want to view customer order history during chat so that I have context | P2 | Order panel visible alongside chat interface |

## 5. Story Mapping Summary

```
User Activity         │ Stories          │ Release
──────────────────────┼──────────────────┼─────────
Register/Login        │ US-01 to US-04   │ MVP
Browse Products       │ US-05 to US-09   │ MVP
Cart & Checkout       │ US-10 to US-16   │ MVP
Track Orders          │ US-17 to US-19   │ MVP
Chat Support          │ US-20 to US-22   │ V1.1
Admin Management      │ US-23 to US-29   │ MVP
Moderator Support     │ US-30 to US-33   │ V1.1
```

## 6. Total Story Count

| Priority | Count |
|----------|-------|
| P0 (Must Have) | 18 |
| P1 (Should Have) | 10 |
| P2 (Nice to Have) | 5 |
| **Total** | **33** |

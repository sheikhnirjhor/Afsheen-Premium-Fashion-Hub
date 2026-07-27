# 11 - Acceptance Criteria

## 1. Purpose

Acceptance criteria define the specific conditions that must be satisfied for each user story to be considered complete. They serve as the "definition of done" for development and testing.

## 2. Format

Each acceptance criterion follows the **Given-When-Then** format:
- **Given** a precondition or context
- **When** an action is performed
- **Then** an expected outcome occurs

## 3. Authentication Module

### US-01: User Registration

| # | Criterion |
|---|-----------|
| AC-01 | **Given** the user is on the registration page, **When** they enter a valid email and password (min 8 chars), **Then** the account is created and a confirmation email is sent |
| AC-02 | **Given** the user enters an already registered email, **When** they submit the form, **Then** an error message "Email already in use" is displayed |
| AC-03 | **Given** the user enters an invalid email format, **When** they submit the form, **Then** a validation error "Please enter a valid email" is shown |
| AC-04 | **Given** the user enters a password shorter than 8 characters, **When** they submit, **Then** a validation error is shown |

### US-02: Google Sign-In

| # | Criterion |
|---|-----------|
| AC-05 | **Given** the user clicks "Sign in with Google", **When** they complete the Google OAuth flow, **Then** they are logged in and redirected to the homepage |
| AC-06 | **Given** a first-time Google user, **When** they complete sign-in, **Then** a new account is auto-created in Firebase |

### US-03: Password Reset

| # | Criterion |
|---|-----------|
| AC-07 | **Given** the user clicks "Forgot Password", **When** they enter their registered email, **Then** a reset link is sent within 30 seconds |
| AC-08 | **Given** the user clicks the reset link, **When** they set a new password, **Then** they can log in with the new password |

## 4. Product Browsing Module

### US-05: Browse by Category

| # | Criterion |
|---|-----------|
| AC-09 | **Given** the user is on the homepage, **When** they click a category, **Then** products filtered by that category are displayed |
| AC-10 | **Given** the user selects a category, **When** the page loads, **Then** the URL updates to reflect the category filter |

### US-06: Search Products

| # | Criterion |
|---|-----------|
| AC-11 | **Given** the user types in the search bar, **When** they enter at least 2 characters, **Then** matching products appear within 500ms |
| AC-12 | **Given** the search has no results, **When** the query is processed, **Then** a "No products found" message is displayed |

### US-07: Product Detail Page

| # | Criterion |
|---|-----------|
| AC-13 | **Given** the user clicks a product card, **When** the detail page loads, **Then** name, price, images, description, and sizes are displayed |
| AC-14 | **Given** the user clicks a product image, **When** they click, **Then** a zoomed view of the image opens |
| AC-15 | **Given** the user clicks "Size Guide", **When** the modal opens, **Then** a size chart with measurements is displayed |

## 5. Cart & Checkout Module

### US-10: Add to Cart

| # | Criterion |
|---|-----------|
| AC-16 | **Given** the user selects a size and clicks "Add to Cart", **When** the action completes, **Then** a success animation shows and cart icon updates with count |
| AC-17 | **Given** the user adds an out-of-stock item, **When** they click "Add to Cart", **Then** the button is disabled and "Out of Stock" is shown |

### US-13: Apply Coupon

| # | Criterion |
|---|-----------|
| AC-18 | **Given** the user enters a valid coupon code, **When** they click "Apply", **Then** the discount is applied and the total updates |
| AC-19 | **Given** the user enters an invalid or expired coupon, **When** they click "Apply", **Then** an error message "Invalid coupon code" is displayed |

### US-15: Shipping Address

| # | Criterion |
|---|-----------|
| AC-20 | **Given** the user is on the checkout page, **When** they submit an incomplete address, **Then** validation errors highlight the missing fields |
| AC-21 | **Given** the user submits a valid address, **When** the form validates, **Then** the address is saved for the order and future checkouts |

### US-16: Place Order

| # | Criterion |
|---|-----------|
| AC-22 | **Given** the user has items in the cart and a valid address, **When** they click "Place Order", **Then** the order is created with status "Pending" and a confirmation page is shown |
| AC-23 | **Given** an order is placed, **When** processing completes, **Then** a confirmation email is sent within 60 seconds |

## 6. Order Tracking Module

### US-17: Order History

| # | Criterion |
|---|-----------|
| AC-24 | **Given** the user is logged in, **When** they visit the order history page, **Then** all their orders are listed with date, status, and total |
| AC-25 | **Given** the user has no orders, **When** they visit the page, **Then** a "No orders yet" message with a "Shop Now" button is shown |

### US-18: Track Order

| # | Criterion |
|---|-----------|
| AC-26 | **Given** the user clicks on an order, **When** the detail view loads, **Then** the current status (Processing/Shipped/Delivered) with timeline is displayed |

## 7. Chat Module

### US-20: Open Chat

| # | Criterion |
|---|-----------|
| AC-27 | **Given** the user is on any page, **When** they click the chat icon, **Then** the chat widget opens with a greeting message |
| AC-28 | **Given** the chat is open, **When** the user clicks outside or clicks close, **Then** the chat minimizes but stays in memory |

### US-21: Send Messages

| # | Criterion |
|---|-----------|
| AC-29 | **Given** the chat is open, **When** the user types and sends a message, **Then** the message appears instantly in the conversation |
| AC-30 | **Given** the moderator is offline, **When** the user sends a message, **Then** an auto-reply "We'll get back to you soon" is shown |

## 8. Admin Module

### US-23: Dashboard Statistics

| # | Criterion |
|---|-----------|
| AC-31 | **Given** the admin logs in, **When** the dashboard loads, **Then** total orders, revenue, users, and products are displayed |
| AC-32 | **Given** the dashboard is displayed, **When** data changes in the database, **Then** the stats update in real-time |

### US-24: Add Product

| # | Criterion |
|---|-----------|
| AC-33 | **Given** the admin fills the product form completely, **When** they submit, **Then** the product is created and appears in the catalog |
| AC-34 | **Given** the admin submits an incomplete form, **When** validation runs, **Then** required field errors are shown |

## 9. Non-Functional Acceptance Criteria

| # | Criterion | Target |
|---|-----------|--------|
| NF-AC-01 | Page load time on 4G network | < 3 seconds |
| NF-AC-02 | API response time for product listing | < 500ms |
| NF-AC-03 | Chat message delivery latency | < 1 second |
| NF-AC-04 | Form submission feedback | Immediate visual feedback |
| NF-AC-05 | Error messages are human-readable | 100% |
| NF-AC-06 | Responsive on screens ≥ 320px width | 100% |
| NF-AC-07 | HTTPS enforced on all pages | 100% |

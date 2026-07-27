# 19 - Test Driven Development (TDD)

## 1. Purpose

This document outlines the Test Driven Development (TDD) approach, test strategy, and test cases for the Afsheen Premium Fashion Hub.

## 2. TDD Overview

TDD is a software development practice where tests are written **before** the production code. The cycle follows **Red → Green → Refactor**:

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│   RED    │───>│  GREEN   │───>│ REFACTOR │
│ Write a  │    │ Write    │    │ Clean up │
│ failing  │    │ minimal  │    │ the code │
│ test     │    │ code to  │    │ while    │
│          │    │ pass     │    │ keeping  │
│          │    │          │    │ tests    │
└──────────┘    └──────────┘    └──────────┘
      ▲                               │
      └───────────────────────────────┘
```

## 3. Test Strategy

### 3.1 Testing Pyramid

```
        ╱╲
       ╱  ╲        E2E Tests (few)
      ╱    ╲       - Full user flows
     ╱──────╲
    ╱        ╲     Integration Tests (some)
   ╱          ╲    - API + Database
  ╱────────────╲
 ╱              ╲   Unit Tests (many)
╱                ╲  - Functions, components, models
╱──────────────────╲
```

### 3.2 Test Types & Tools

| Test Type | Scope | Tool | Priority |
|-----------|-------|------|----------|
| Unit Tests | Individual functions/components | Jest + React Testing Library | High |
| Integration Tests | API endpoints + Firestore | pytest + httpx + mock Firebase | High |
| E2E Tests | Full user flows | Cypress / Playwright | Medium |
| Linting | Code quality | ESLint (JS), Ruff (Python) | High |
| Type Checking | Type safety | TypeScript / mypy | Medium |

### 3.3 Test Coverage Targets

| Module | Target Coverage |
|--------|----------------|
| Backend routes | 80%+ |
| Backend models/schemas | 90%+ |
| Frontend components | 70%+ |
| Context providers | 80%+ |
| Utility functions | 90%+ |

## 4. Backend Test Cases

### 4.1 Authentication Tests

| Test ID | Test Case | Input | Expected Result |
|---------|-----------|-------|-----------------|
| BT-AUTH-01 | Register with valid data | {name, email, password} | 201 Created, user returned |
| BT-AUTH-02 | Register with existing email | Duplicate email | 400 "Email already in use" |
| BT-AUTH-03 | Register with invalid email | "notanemail" | 400 "Invalid email format" |
| BT-AUTH-04 | Register with short password | "abc" | 400 "Password too short" |
| BT-AUTH-05 | Login with valid credentials | {email, password} | 200, token returned |
| BT-AUTH-06 | Login with wrong password | {email, wrong_pass} | 401 "Invalid credentials" |
| BT-AUTH-07 | Access protected route without token | No header | 401 "Not authenticated" |
| BT-AUTH-08 | Access admin route with customer role | Customer token | 403 "Insufficient permissions" |

### 4.2 Product Tests

| Test ID | Test Case | Input | Expected Result |
|---------|-----------|-------|-----------------|
| BT-PROD-01 | Get all products | GET /api/products | 200, array of products |
| BT-PROD-02 | Get products by category | ?category=dresses | 200, filtered products |
| BT-PROD-03 | Search products by name | ?search=floral | 200, matching products |
| BT-PROD-04 | Get single product | GET /api/products/{id} | 200, product object |
| BT-PROD-05 | Get non-existent product | Invalid ID | 404 "Product not found" |
| BT-PROD-06 | Create product (admin) | Valid product data | 201, product created |
| BT-PROD-07 | Create product (non-admin) | Customer token | 403 Forbidden |
| BT-PROD-08 | Update product | Valid changes | 200, product updated |
| BT-PROD-09 | Delete product | Valid ID | 200, product deleted |
| BT-PROD-10 | Create product missing required fields | Incomplete data | 400 Validation error |

### 4.3 Order Tests

| Test ID | Test Case | Input | Expected Result |
|---------|-----------|-------|-----------------|
| BT-ORD-01 | Create order (valid) | Cart + address + COD | 201, order created |
| BT-ORD-02 | Create order (empty cart) | Empty cart | 400 "Cart is empty" |
| BT-ORD-03 | Create order (out of stock) | Unavailable size | 400 "Out of stock" |
| BT-ORD-04 | Get user orders | Authenticated user | 200, user's orders |
| BT-ORD-05 | Get order detail | Valid order ID | 200, order with items |
| BT-ORD-06 | Get other user's order | Different user's ID | 403 Forbidden |
| BT-ORD-07 | Update order status (admin) | Valid status | 200, status updated |
| BT-ORD-08 | Update order status (customer) | Customer token | 403 Forbidden |

### 4.4 Coupon Tests

| Test ID | Test Case | Input | Expected Result |
|---------|-----------|-------|-----------------|
| BT-COUP-01 | Validate valid coupon | ACTIVECODE | 200, discount info |
| BT-COUP-02 | Validate expired coupon | EXPIREDCODE | 400 "Coupon expired" |
| BT-COUP-03 | Validate maxed-out coupon | USEDCODE | 400 "Usage limit reached" |
| BT-COUP-04 | Validate non-existent coupon | FAKECODE | 404 "Coupon not found" |

## 5. Frontend Test Cases

### 5.1 Component Tests

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| FT-NAV-01 | Navbar renders logo and links | Logo + nav links visible |
| FT-NAV-02 | Cart badge shows correct count | Badge = cart items count |
| FT-NAV-03 | Authenticated user shows logout | Login → Logout button |
| FT-PROD-01 | Product card shows name, price, image | All fields rendered |
| FT-PROD-02 | Product list filters by category | Only matching products shown |
| FT-CART-01 | Add item to cart updates count | Cart count increments |
| FT-CART-02 | Remove item from cart | Item removed, total updated |
| FT-CART-03 | Empty cart shows message | "Your cart is empty" displayed |
| FT-CHECK-01 | Checkout form validates address | Errors shown for missing fields |
| FT-CHECK-02 | Coupon input validates code | Error for invalid, success for valid |
| FT-CHAT-01 | Chat widget opens on click | Chat panel slides in |
| FT-CHAT-02 | Send message appears in chat | Message rendered in conversation |

### 5.2 Context Tests

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| FT-AUTH-01 | Login sets user in context | user object populated |
| FT-AUTH-02 | Logout clears user | user = null |
| FT-AUTH-03 | Unauthenticated user redirected | Redirect to /login |
| FT-CART-01 | Cart persists across page loads | Items maintained in localStorage |
| FT-CART-02 | Cart total calculated correctly | Sum of (price × quantity) |

## 6. Test Execution

### Commands

```bash
# Frontend tests
cd frontend && npm test                    # Run all tests
cd frontend && npm test -- --coverage      # With coverage report
cd frontend && npm run lint                # Lint check

# Backend tests
cd backend && pytest                       # Run all tests
cd backend && pytest --cov=.              # With coverage
cd backend && ruff check .               # Lint check
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml (planned)
name: Test Suite
on: [push, pull_request]
jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd frontend && npm ci && npm test

  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
      - run: cd backend && pip install -r requirements.txt && pytest
```

## 7. TDD Workflow for New Features

1. **Write a failing test** that defines the expected behavior
2. **Run the test** to confirm it fails (RED)
3. **Write minimal code** to make the test pass (GREEN)
4. **Run the test** to confirm it passes
5. **Refactor** the code for clarity and performance
6. **Run tests again** to ensure nothing broke
7. **Commit** with a clear message

## 8. Quality Gates

| Gate | Criteria | Blocking |
|------|----------|----------|
| All tests pass | 0 failures | Yes |
| Code coverage | ≥ 70% overall | Warning |
| Lint check | 0 errors | Yes |
| Type check | 0 type errors | Warning |
| Build succeeds | No build errors | Yes |

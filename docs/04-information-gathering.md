# 04 - Information Gathering

## 1. Purpose

This document outlines the methods and findings from the information gathering phase of the Afsheen Premium Fashion Hub project. The goal was to understand user needs, market trends, and technical requirements to inform the system design.

## 2. Methods Used

| # | Method | Target Group | Duration |
|---|--------|-------------|----------|
| 1 | Stakeholder Interviews | Business owner, managers | Week 1 |
| 2 | Customer Surveys | Existing customers (50+) | Week 1–2 |
| 3 | Competitor Analysis | 5 competitor platforms | Week 1 |
| 4 | Market Research | Fashion e-commerce trends | Week 1–2 |
| 5 | Technical Feasibility Study | Development team | Week 2 |

## 3. Key Findings

### 3.1 Customer Preferences

- **85%** of surveyed customers prefer browsing products on mobile devices
- **72%** want detailed product images from multiple angles
- **68%** prefer cash-on-delivery as a payment option
- **90%** expect order tracking functionality
- **78%** want a size guide before purchasing
- **65%** have abandoned carts on other platforms due to complex checkout

### 3.2 Market Trends

- Fashion e-commerce in Pakistan is growing at 25% YoY
- Social commerce (Instagram, Facebook) drives 40% of fashion sales
- Premium segments demand high-quality visuals and seamless UX
- WhatsApp-based ordering remains dominant but is not scalable
- Customers increasingly compare prices across platforms before purchasing

### 3.3 Competitor Analysis

| Competitor | Strengths | Weaknesses |
|-----------|-----------|------------|
| Brand A | Strong social media presence | No size guide, slow checkout |
| Brand B | Wide product range | Poor mobile experience |
| Brand C | Fast delivery | Limited product info |
| Brand D | Good customer support | No order tracking |
| Brand E | Premium branding | High prices, no discounts |

### 3.4 Technical Requirements

- **Frontend Framework:** React.js chosen for component reusability and ecosystem
- **CSS Framework:** Tailwind CSS for rapid, consistent UI development
- **Backend Framework:** FastAPI for async performance and auto-generated API docs
- **Database:** Firebase Firestore for real-time data and easy scaling
- **Authentication:** Firebase Auth for secure, turnkey authentication
- **Hosting:** Vercel (frontend) + Railway/Render (backend) for cost efficiency

### 3.5 Business Requirements

- Product catalog with categories, images, pricing, and variants
- Shopping cart and multi-step checkout
- User registration and authentication
- Admin panel for product and order management
- Coupon/discount system for promotions
- Customer support chat
- Order tracking and history

## 4. Data Sources

| Source | Type | Reliability |
|--------|------|------------|
| Customer surveys (50+ responses) | Primary | High |
| Stakeholder interviews (5 sessions) | Primary | High |
| Google Trends | Secondary | Medium |
| Statista fashion reports | Secondary | High |
| Competitor websites | Secondary | Medium |
| Industry blogs and articles | Secondary | Low–Medium |

## 5. Assumptions from Research

1. Customers will tolerate a 3-second page load time
2. Firebase free tier is sufficient for initial launch (50K reads/day)
3. Most customers will browse before buying (low initial conversion rate)
4. WhatsApp integration can be added in Phase 2
5. Cash-on-delivery will be the primary payment method initially

## 6. Recommendations

1. Prioritize mobile-first responsive design
2. Include high-quality product photography
3. Keep checkout flow to 3 steps maximum
4. Implement product search and filtering early
5. Add a size guide for clothing categories
6. Plan for WhatsApp order integration in future sprints

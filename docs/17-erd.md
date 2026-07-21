# 17. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    CATEGORY ||--|{ PRODUCT : contains
    PRODUCT ||--|{ CART_ITEM : included_in
    USER ||--o{ CART : owns

    PRODUCT {
        string id PK
        string name
        number price
        string category
    }
    CART_ITEM {
        string id PK
        string productId FK
        number quantity
    }

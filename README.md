## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Cart API - Discount & Tax Calculation

## Overview

This document explains how the **discount and tax** are applied to the cart totals in the `/api/cart-listing` route.

## Discount Calculation

- **If the subtotal is greater than ₹2500**, a **5% discount** is applied.
- **If the subtotal is ₹2500 or less**, no discount is applied.

### **Discount Formula**

```typescript
const discount = subtotal > 2500 ? Math.floor(subtotal * 0.05) : 0;
```

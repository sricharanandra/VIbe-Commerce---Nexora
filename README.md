# Vibe Commerce - Shopping Cart Application

A full-stack e-commerce shopping cart application built with React, TypeScript, Node.js, Express, and PostgreSQL.

## Features

- Browse product catalog with images and descriptions
- Add products to shopping cart
- Update item quantities in cart
- Remove items from cart
- Complete checkout with customer information
- Mock order receipt generation
- Responsive dark theme UI
- Persistent cart data in PostgreSQL database

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- CSS for styling (dark theme)

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL for data persistence
- RESTful API architecture

## Project Structure

```
nexora/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── db.ts          # Database connection
│   │   │   └── setup.ts       # Database schema and seed data
│   │   ├── routes/
│   │   │   ├── products.ts    # Product endpoints
│   │   │   ├── cart.ts        # Cart endpoints
│   │   │   └── checkout.ts    # Checkout endpoint
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript type definitions
│   │   └── index.ts           # Express server entry point
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Products.tsx   # Products listing page
    │   │   ├── Cart.tsx       # Shopping cart page
    │   │   └── Checkout.tsx   # Checkout page
    │   ├── api.ts             # API client functions
    │   ├── types.ts           # TypeScript interfaces
    │   ├── App.tsx            # Main app component
    │   ├── App.css            # Global styles
    │   └── main.tsx           # React entry point
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart` - Get cart items with total
- `POST /api/cart` - Add item to cart
  - Body: `{ productId: number, quantity: number }`
- `PUT /api/cart/:id` - Update cart item quantity
  - Body: `{ quantity: number }`
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Checkout
- `POST /api/checkout` - Process checkout and create order
  - Body: `{ customerName: string, customerEmail: string, cartItems: CartItem[] }`
- `GET /api/checkout/orders` - Get all orders (bonus feature)

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:
```bash
createdb vibecommerce
```

Or using psql:
```sql
CREATE DATABASE vibecommerce;
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` with your database connection string:
```
PORT=5000
DATABASE_URL=postgresql://localhost:5432/vibecommerce
NODE_ENV=development
```

5. Setup database tables and seed data:
```bash
npm run db:setup
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Usage

1. Start the backend server (must be running first)
2. Start the frontend development server
3. Open http://localhost:3000 in your browser
4. Browse products and add items to cart
5. View cart and update quantities
6. Proceed to checkout and enter customer information
7. View order receipt after successful checkout

## Database Schema

### products
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- price (DECIMAL)
- description (TEXT)
- image_url (TEXT)
- created_at (TIMESTAMP)

### cart_items
- id (SERIAL PRIMARY KEY)
- product_id (INTEGER, FK to products)
- quantity (INTEGER)
- created_at (TIMESTAMP)

### orders
- id (SERIAL PRIMARY KEY)
- customer_name (VARCHAR)
- customer_email (VARCHAR)
- total_amount (DECIMAL)
- order_data (JSONB)
- created_at (TIMESTAMP)

## Features Implemented

- ✅ Product catalog with 10 mock items
- ✅ Add to cart functionality
- ✅ Update cart item quantities
- ✅ Remove items from cart
- ✅ Cart total calculation
- ✅ Checkout form with validation
- ✅ Order receipt modal
- ✅ PostgreSQL database persistence
- ✅ Error handling
- ✅ Responsive design
- ✅ Dark theme UI
- ✅ TypeScript throughout

## Screenshots

### Products Page
The main products grid displays all available items with images, descriptions, prices, and add to cart buttons.

### Cart Page
The shopping cart shows all added items with quantity controls, remove buttons, and order summary with total.

### Checkout Page
The checkout form collects customer information and displays an order summary before placing the order.

### Order Receipt
After successful checkout, a modal displays the order confirmation with order details and receipt.

## Development Notes

- The application uses a simple single-user cart model (no authentication)
- Images are sourced from Unsplash for demonstration purposes
- Checkout is mock only - no payment processing
- The cart badge in navigation updates automatically
- All API calls include error handling

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Future Enhancements

- User authentication and multi-user support
- Product search and filtering
- Product categories
- Order history page
- Payment gateway integration
- Product inventory management
- Admin dashboard

## License

This project is for educational purposes as part of the Vibe Commerce coding assessment.

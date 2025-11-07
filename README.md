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

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/sricharanandra/VIbe-Commerce---Nexora.git
cd vibe-commerce
```

2. **Run the setup script**

```bash
chmod +x setup.sh
./setup.sh
```

The setup script will automatically:
- Check PostgreSQL installation and service status
- Create the `vibecommerce` database
- Install all backend and frontend dependencies
- Create `.env` configuration files
- Set up database schema with tables
- Seed sample product data

3. **Start the application**

```bash
chmod +x start.sh
./start.sh
```

This will start both servers:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

**That's it!** Open http://localhost:3000 in your browser to use the application.


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
## License

This project is for educational purposes as part of the Vibe Commerce coding assessment.

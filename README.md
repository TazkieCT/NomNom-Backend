# NomNom Backend

A RESTful API backend for NomNom, a food marketplace platform that connects customers with stores offering surplus food deals.

## Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Role-based access control (Customer, Seller, Admin)
- Protected routes with middleware
- Profile management
- Apply to become a seller

### Store Management
- Create and manage stores
- Update store information (name, description, location, contact)
- View all stores or individual store details
- Store ownership verification

### Food Product Management
- Add, update, and delete food products
- Product details (name, description, price, discount, expiry date)
- Product images and categories
- Stock management
- Filter products by store

### Category Management
- Create and manage food categories
- Assign products to categories
- Browse products by category

### Dietary Filters
- Support for dietary preferences (Vegan, Vegetarian, Halal, Kosher, etc.)
- Filter products based on dietary requirements

### Coupon System
- Create and manage discount coupons
- Apply coupons to orders
- Track coupon usage and validity

### Order Management
- Place orders for food products
- View order history
- Track order status
- Seller order management
- Order tracking by customer and seller

### Review System
- Submit reviews and ratings for stores
- View store reviews
- Rating aggregation

### App Rating
- Submit app ratings and feedback
- View overall app ratings
- Track user satisfaction

### API Documentation
- Complete Swagger/OpenAPI documentation
- Interactive API testing interface
- Available at `/api-docs`

## Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Documentation**: Swagger UI Express
- **Environment Variables**: dotenv
- **CORS**: cors middleware

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/TazkieCT/NomNom-Backend.git
cd NomNom-Backend
```

2. Install dependencies:
```bash
npm install
```

Or install specific packages:
```bash
npm install jsonwebtoken dotenv bcryptjs cors mongoose express swagger-ui-express swagger-jsdoc
npm install --save-dev nodemon
```

3. Copy the .env.copy file and rename it to .env, then update the values as needed:
```bash
cp .env.copy .env
```

4. Start the development server:
```bash
npm run dev
```

Or use nodemon directly:
```bash
npx nodemon server.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)
- `POST /api/auth/become-seller` - Apply to become a seller (Protected)

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create a new store (Protected - Seller)
- `PUT /api/stores/:id` - Update store (Protected - Owner)
- `DELETE /api/stores/:id` - Delete store (Protected - Owner)

### Foods
- `GET /api/foods` - Get all food products
- `GET /api/foods/:id` - Get food by ID
- `GET /api/foods/store/:storeId` - Get foods by store
- `POST /api/foods` - Create a new food product (Protected - Seller)
- `PUT /api/foods/:id` - Update food product (Protected - Owner)
- `DELETE /api/foods/:id` - Delete food product (Protected - Owner)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create a new category (Protected - Admin)
- `PUT /api/categories/:id` - Update category (Protected - Admin)
- `DELETE /api/categories/:id` - Delete category (Protected - Admin)

### Orders
- `GET /api/orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `GET /api/orders/seller/:sellerId` - Get seller orders (Protected - Seller)
- `POST /api/orders` - Create a new order (Protected)
- `PUT /api/orders/:id` - Update order status (Protected)

### Reviews
- `GET /api/reviews/store/:storeId` - Get store reviews
- `POST /api/reviews` - Submit a review (Protected)
- `PUT /api/reviews/:id` - Update review (Protected - Owner)
- `DELETE /api/reviews/:id` - Delete review (Protected - Owner)

### Coupons
- `GET /api/coupons` - Get all coupons
- `GET /api/coupons/:code` - Get coupon by code
- `POST /api/coupons` - Create a new coupon (Protected - Seller)
- `PUT /api/coupons/:id` - Update coupon (Protected - Owner)
- `DELETE /api/coupons/:id` - Delete coupon (Protected - Owner)

### Dietary Filters
- `GET /api/filters` - Get all dietary filters
- `POST /api/filters` - Create a new filter (Protected - Admin)

### App Ratings
- `GET /api/app-ratings` - Get all app ratings
- `POST /api/app-ratings` - Submit app rating (Protected)

### Health Check
- `GET /health` - API health check

## Project Structure

```
NomNom-Backend/
├── config/
│   ├── db.js              # MongoDB connection configuration
│   └── swagger.js         # Swagger API documentation setup
├── controllers/           # Request handlers
├── middleware/            # Authentication & authorization middleware
├── models/                # Mongoose schemas
├── repositories/          # Database operations
├── routes/                # API route definitions
├── utils/                 # Utility functions
├── server.js              # Application entry point
└── package.json           # Project dependencies
```

## API Documentation

Once the server is running, access the interactive API documentation at:
```
http://localhost:4000/api-docs
```

## Scripts

- `npm start` - Start the production server
- `npm run dev` or `npx nodemon server.js` - Start development server with nodemon

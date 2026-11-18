# LUXERA Fine Fragrance House — Backend API

An enterprise-grade RESTful API engineered for **LUXERA**, an haute parfumerie luxury fragrance boutique. Built with **Node.js**, **Express 5**, **TypeScript**, and **MongoDB**, featuring JWT authentication, role-based access control (RBAC), automated Nodemailer transactional emails, and Supabase integration.

---

## Architecture Overview

```
                      +-----------------------------+
                      |   LUXERA React Frontend     |
                      +--------------+--------------+
                                     |
                                REST | HTTPS / JSON
                                     v
                      +-----------------------------+
                      |     Express 5 / Node.js     |
                      |      TypeScript Server      |
                      +--------------+--------------+
                                     |
         +---------------------------+---------------------------+
         |                           |                           |
         v                           v                           v
+-------------------+       +-------------------+       +-------------------+
|  MongoDB Atlas    |       |   Nodemailer      |       |  Supabase CDN     |
|  Mongoose Models  |       |   Gmail SMTP      |       |  Product Media    |
+-------------------+       +-------------------+       +-------------------+
```

---

## Core Capabilities & Modules

- **Authentication & Security**:
  - Secure password hashing using `bcryptjs` (salt rounds: 10).
  - Stateless JSON Web Token (`jsonwebtoken`) authentication with role-based authorization (`CLIENT`, `ADMIN`).
  - Strict input sanitization and route-level protection middleware.
- **Product Management**:
  - Full CRUD operations for luxury fragrance flacons.
  - Granular olfactory profiling (top notes, heart notes, base notes, longevity ratings, sillage/projection, volume, price).
- **Order Processing & Automation**:
  - Atomic order creation with sequential batch numbering (`LX-YYYYMMDD-XXXX`).
  - Status lifecycle management: `Pending` -> `Processing` -> `Delivered` -> `Cancelled`.
  - Automated transactional order confirmation emails sent directly to the customer's registered email via Nodemailer.
- **Customer Reviews**:
  - Product-level reviews and star ratings.
  - Verified buyer attribution and feedback analytics.
- **Client & User Administration**:
  - Administrative user directory with search, role modification, and account removal.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Node.js** (v20+) | High-performance asynchronous JavaScript runtime |
| **Express 5** | RESTful HTTP application framework |
| **TypeScript 5+** | Strongly typed code structure and compile-time safety |
| **MongoDB & Mongoose** | NoSQL document database and object data modeling (ODM) |
| **JSON Web Tokens (JWT)** | Token-based stateless authentication |
| **Bcryptjs** | Cryptographic password hashing |
| **Nodemailer** | SMTP mailer for order dispatch notifications |
| **Multer** | Multipart form-data parser for media asset handling |
| **Cors & Dotenv** | Cross-Origin Resource Sharing & Environment management |
| **TSX** | Ultra-fast TypeScript execution engine for development |

---

## Project Structure

```
RAD final backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts        # Registration, Login, User CRUD
│   │   ├── orderController.ts       # Order placement, status tracking, admin orders
│   │   ├── productController.ts     # Perfume catalog management
│   │   └── reviewController.ts      # Product ratings & testimonials
│   ├── middleware/
│   │   └── auth.ts                  # JWT verification & RBAC guard
│   ├── models/
│   │   ├── orderModel.ts            # Order schema & status enum
│   │   ├── productModel.ts          # Perfume specifications schema
│   │   ├── reviewModel.ts           # Customer review schema
│   │   └── userModel.ts             # User credentials & roles schema
│   ├── routers/
│   │   ├── authRouter.ts            # Auth & user routes
│   │   ├── orderRouter.ts           # Checkout & order routes
│   │   ├── productRouter.ts         # Fragrance catalog routes
│   │   └── reviewRouter.ts          # Reviews routes
│   ├── util/
│   │   ├── emailService.ts          # Nodemailer HTML template engine
│   │   └── jwtUtil.ts               # Token generator & verifier
│   └── index.ts                     # Server initialization & database connection
├── dist/                            # Compiled production JavaScript
├── package.json                     # Dependencies and build scripts
├── tsconfig.json                    # TypeScript compiler configuration
└── .env                             # Environment configuration (ignored in git)
```

---

## Getting Started

### Prerequisites

- **Node.js** (v20.0.0 or higher recommended)
- **npm** (v10.0.0+)
- **MongoDB** instance (Local or MongoDB Atlas connection string)
- **SMTP Credentials** (e.g., Gmail App Password for email notifications)

---

### Installation

1. **Navigate to the backend directory**:
   ```bash
   cd "RAD final backend"
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

---

### Environment Configuration

Create a `.env` file in the root of the backend folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/luxera-db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_super_secret_access_key
JWT_REFRESH_SECRET=your_jwt_super_secret_refresh_key

EMAIL_SERVICE=gmail
EMAIL_USER=your_boutique_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Note for Gmail Users**: Use a 16-character [Google App Password](https://myaccount.google.com/apppasswords) rather than your standard account password.

---

### Running the Server

#### Development Mode (with hot-reload via TSX):
```bash
npm run dev
```
The server will initialize on `http://localhost:5000`.

#### Production Build & Start:
```bash
npm run build
npm start
```

---

## API Reference

### 1. Authentication & Users (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register client (`firstName`, `lastName`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current session profile |
| `GET` | `/api/auth/users` | Admin | Retrieve all registered clients & staff |
| `PUT` | `/api/auth/users/:id` | Admin | Update user details, email, or roles |
| `DELETE`| `/api/auth/users/:id` | Admin | Remove user account from system |

### 2. Products Catalog (`/api/products`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Fetch catalog with optional filters & search |
| `GET` | `/api/products/:id` | Public | Retrieve detailed perfume dossier |
| `POST` | `/api/products` | Admin | Create new fragrance listing |
| `PUT` | `/api/products/:id` | Admin | Update specifications, pricing, stock, notes |
| `DELETE`| `/api/products/:id` | Admin | Delete perfume from catalog |

### 3. Orders & Checkout (`/api/orders`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Authenticated | Place order, assign Pending status, send confirmation email |
| `GET` | `/api/orders/my-orders`| Authenticated | View current client's order history |
| `GET` | `/api/orders` | Admin | View all orders across all clients |
| `PUT` | `/api/orders/:id/status`| Admin | Update fulfillment status (`Pending`, `Processing`, etc.) |
| `DELETE`| `/api/orders/:id` | Admin | Cancel and remove an order record |

### 4. Reviews & Ratings (`/api/reviews`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews/:productId`| Public | Get all reviews for a specific fragrance |
| `POST` | `/api/reviews` | Authenticated | Submit verified fragrance review & rating |
| `DELETE`| `/api/reviews/:id` | Admin / Author | Remove a review |

---

## License

Crafted for **LUXERA Fine Fragrance House**. All rights reserved.

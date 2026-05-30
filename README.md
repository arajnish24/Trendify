# Trendify - Food Restaurant & Ecommerce Platform

Trendify is a modern, full-stack MERN (MongoDB, Express, React, Node.js) application designed for a seamless food restaurant and ecommerce experience. It features a robust product management system, secure user authentication, an integrated shopping cart, and a multi-stage order tracking system with payment gateway integration.

---

## 🏗️ Architecture Overview

Trendify is built using a **Decoupled Client-Server Architecture**, ensuring scalability and clear separation of concerns.

### 🎨 Frontend (Client)
- **Framework:** React 19 (managed with Vite for ultra-fast builds).
- **Routing:** React Router 7 for dynamic, client-side navigation.
- **State Management:** React Context API for centralized **Auth** and **Cart** state.
- **Styling:** Modular CSS3 with a focus on responsiveness and professional aesthetics.
- **Persistence:** `localStorage` integration for persistent user sessions and cart data.

### ⚙️ Backend (Server)
- **Environment:** Node.js with Express 5 framework.
- **Database:** MongoDB for flexible, document-based data storage, interfaced via Mongoose.
- **Security:** JWT (JSON Web Tokens) for stateless authentication and Bcrypt.js for secure password hashing.
- **File Handling:** Multer for managing product image uploads.
- **Payments:** Integrated Razorpay API for secure online transactions.

---

## 🚀 Key Features

### 👤 Customer Experience
*   **Secure Authentication:** JWT-based login/register system with role-based access control.
*   **Dynamic Catalog:** Browse products across multiple categories with real-time stock validation.
*   **Advanced Cart System:** 
    *   Real-time quantity updates.
    *   Smart suggestions (4 random products) when the cart is empty.
    *   Persistence across browser sessions.
*   **Checkout & Payments:**
    *   Multiple address management.
    *   **Online Payment:** Razorpay integration for instant transactions.
    *   **COD Support:** Cash on Delivery with an automated ₹9.00 handling fee.
*   **Order Lifecycle Tracking:**
    *   **Visual Timeline:** Track orders through *Placed ➔ Shipped ➔ Delivered*.
    *   **Post-Delivery Actions:** Request **Returns** or **Replacements** with mandatory reason tracking.
    *   **Real-time Notifications:** Contextual banners for admin updates and next steps.

### 🛡️ Admin Suite
*   **Analytics Dashboard:** Live tracking of Total Sales, Orders, Customers, and Product metrics.
*   **Inventory Management:** Full CRUD operations for products with "Low Stock" indicators.
*   **Order Fulfillment:** Comprehensive management interface for 15+ order statuses (Pending, Shipped, Refunded, etc.).
*   **Customer Directory:** Centralized list of all registered users with formatted contact details.
*   **Role-Based Security:** Protected `AdminRoute` wrapper ensures sensitive management pages are only accessible to authorized accounts.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router 7, Context API, CSS3 |
| **Backend** | Node.js, Express 5, JWT, Bcrypt.js, Multer |
| **Database** | MongoDB, Mongoose |
| **Payments** | Razorpay API |
| **Tools** | ESLint, Nodemon, Git |

---

## 📂 Project Structure

```text
├── client/                # React frontend (Vite)
│   ├── public/            # Static assets (icons, logos)
│   ├── src/
│   │   ├── components/    # UI elements (Navbar, Footer, AdminRoute)
│   │   ├── context/       # Global state (AuthContext, CartContext)
│   │   ├── pages/         # Feature-specific views (Home, Cart, AdminDashboard)
│   │   ├── data/          # Local data constants
│   │   └── App.jsx        # Routing and provider configuration
├── server/                # Express backend
│   ├── controllers/       # Request handlers and business logic
│   ├── models/            # Mongoose schemas (User, Product, Order)
│   ├── routes/            # API endpoint definitions
│   ├── middleware/        # Auth & Upload handlers
│   ├── init/              # Database seeding scripts
│   └── server.js          # Entry point
└── FEATURES_REFERENCE.md  # Detailed implementation notes
```

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local or Atlas)
- **Razorpay Account** (for API keys)

### 1. Clone & Install
```bash
git clone <repository-url>
cd food-restaurant

# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install
```

### 2. Environment Setup
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Initialize Database
Seed the database with sample products:
```bash
cd server
node init/index.js
```

### 4. Run the Application
You can launch both the **Client** and **Server** simultaneously with a single command from the project root:

```bash
npm run dev
```

*Alternatively, to run them separately:*
- **Backend:** `cd server && npm run dev`
- **Frontend:** `cd client && npm run dev`

*Access the app at `http://localhost:5173`*

---

## 📡 API Endpoints (Summary)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/users/register` | Create a new user account |
| `POST` | `/api/users/login` | Authenticate user & receive JWT |
| `GET` | `/api/products` | Fetch all available products |
| `POST` | `/api/orders` | Create a new order (COD/Online) |
| `PATCH` | `/api/orders/:id/status` | (Admin) Update order status |
| `POST` | `/api/payment/order` | Create Razorpay order |

---

## 📝 License
This project is licensed under the **ISC License**.

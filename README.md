# Trendify - Food Restaurant & Ecommerce Platform

Trendify is a comprehensive full-stack MERN (MongoDB, Express, React, Node.js) application designed for a modern food restaurant and ecommerce experience. It features a robust product management system, secure user authentication, an integrated shopping cart, and a seamless checkout process with payment gateway integration.

## 🏗️ Architecture Overview

The project follows a decoupled **Client-Server architecture**:

-   **Frontend (Client):** A dynamic Single Page Application (SPA) built with **React** and **Vite**. It manages state using the **Context API** for authentication and shopping cart functionality, providing a fast and responsive user experience.
-   **Backend (Server):** A RESTful API built with **Node.js** and **Express**. It handles business logic, database interactions via **Mongoose**, and secure authentication using **JWT**.
-   **Database:** **MongoDB** serves as the primary data store, using schemas to ensure data integrity for Users, Products, Orders, and Subscribers.

---

## 🚀 Key Features

### 👤 User Experience
-   **Secure Authentication:** JWT-based registration and login with encrypted passwords (bcrypt).
-   **Dynamic Product Catalog:** Browse and filter products across multiple categories (Bags, Decorations, Woolen Clothes, etc.).
-   **Advanced Shopping Cart:** Real-time quantity updates, persistent storage (localStorage), and smart product suggestions when empty.
-   **Comprehensive Checkout:**
    -   Multiple address management.
    -   Secure online payments via **Razorpay integration**.
    -   **Cash on Delivery (COD)** support with automated handling fees.
-   **Order Lifecycle Tracking:**
    -   Interactive timeline (Placed ➔ Shipped ➔ Delivered).
    -   Support for **Returns** and **Replacements** with reason tracking.
    -   Contextual status updates and notifications.

### 🛡️ Admin Suite
-   **Centralized Dashboard:** Real-time analytics for sales, orders, and customer metrics.
-   **Inventory Management:** Full CRUD operations for products, including automated image uploads (Multer) and low-stock indicators.
-   **Order Fulfillment:** A powerful management interface to track and update order statuses (15+ states supported).
-   **Customer Directory:** Detailed view of registered users and their contact information.

---

## 🛠️ Tech Stack

-   **Frontend:** React 19, Vite, React Router 7, Context API, CSS3.
-   **Backend:** Node.js, Express 5.
-   **Database:** MongoDB, Mongoose.
-   **Authentication:** JSON Web Tokens (JWT), Bcrypt.js.
-   **File Uploads:** Multer.
-   **Payments:** Razorpay API.

---

## 📂 Project Structure

```text
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI elements (Navbar, Footer, etc.)
│   │   ├── context/       # Global state (AuthContext, CartContext)
│   │   ├── pages/         # Page components (Home, Products, Admin panels)
│   │   └── App.jsx        # Routing configuration
├── server/                # Express backend
│   ├── controllers/       # Business logic for API endpoints
│   ├── models/            # Mongoose schemas (User, Product, Order, Subscriber)
│   ├── routes/            # API route definitions
│   ├── middleware/        # Authentication and file upload handlers
│   ├── init/              # Database seeding scripts
│   └── server.js          # Main entry point
```

---

## 🏁 Getting Started

### Prerequisites
-   **Node.js** (v18 or higher recommended)
-   **MongoDB** (Local instance or MongoDB Atlas)
-   **Razorpay Account** (for API keys)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd food-restaurant
```

### 2. Backend Setup
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    ```
4.  **Initialize the Database** (Seed with sample products):
    ```bash
    node init/index.js
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup
1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Access the application at `http://localhost:5173`.

---

## 📡 API Endpoints (Quick Reference)

-   `POST /api/users/register` - Register a new user
-   `POST /api/users/login` - User login
-   `GET /api/products` - Fetch all products
-   `POST /api/orders` - Create a new order
-   `GET /api/orders/myorders` - Fetch logged-in user's orders
-   `POST /api/payment/verify` - Verify Razorpay payment signature

---

## 📝 License
This project is licensed under the **ISC License**.

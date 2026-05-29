# Trendify - Food Restaurant & Ecommerce Platform

Trendify is a full-stack MERN (MongoDB, Express, React, Node.js) application that combines a food restaurant experience with ecommerce features. It provides a platform for users to browse products (bags, decorations, woolen clothes, etc.), manage a cart, and make secure payments via Razorpay. It also includes a robust admin dashboard for managing products, orders, and users.

## 🚀 Key Features

### User Features
- **User Authentication:** Secure registration and login using JWT and bcrypt.
- **Product Browsing:** Explore products across various categories like Bags, Decorations, Woolen Clothes, etc.
- **Shopping Cart:** Add/remove items and manage quantities.
- **Checkout Workflow:** 
  - Address management (multiple addresses support).
  - Payment details (card management).
  - Secure payment integration with **Razorpay**.
- **Order Tracking:** Users can view their order history.
- **Contact & FAQ:** Dedicated pages for customer support and common queries.

### Admin Features
- **Dashboard:** Overview of the platform's performance.
- **Product Management:** Full CRUD operations (Create, Read, Update, Delete) for products, including image uploads using Multer.
- **Order Management:** Track and manage customer orders.
- **Customer Management:** View and manage registered users.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, Context API (for Auth and Cart state).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (using Mongoose ODM).
- **Authentication:** JSON Web Tokens (JWT).
- **File Uploads:** Multer (for product images).
- **Payments:** Razorpay API.
- **Styling:** CSS3.

---

## 📂 Project Structure

```text
├── client/                # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth and Cart context providers
│   │   ├── pages/         # Page components (Home, Products, Admin, etc.)
│   │   └── App.jsx        # Main routing and app structure
├── server/                # Express backend
│   ├── controllers/       # Route handlers logic
│   ├── models/            # Mongoose schemas (User, Product, Order)
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth and upload middlewares
│   ├── uploads/           # Stored product images
│   └── server.js          # Entry point
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed or a MongoDB Atlas account
- Razorpay API keys (for payments)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd food-restaurant
```

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your configurations:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
4. Initialize the database with sample data (optional):
   ```bash
   node init/index.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 📝 License
This project is licensed under the ISC License.

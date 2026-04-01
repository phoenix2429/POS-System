# 🧾 Retail Billing System (POS)

A full-stack **Retail Billing / Point of Sale (POS) System** built using **ReactJS (Frontend)** and **Spring Boot (Backend)** with **H2 Database**. This application enables efficient product management, billing, order tracking, and sales analytics for retail environments.

---

## 🚀 Features

### 🔐 Authentication & Security

* Secure login using **JWT (JSON Web Token)**
* Role-based access (Admin/User)
* Password encryption using BCrypt

---

### 📊 Dashboard

* View **total sales**, **total orders**, and **today’s revenue**
* Displays **recent transactions**
* Real-time analytics from backend

---

### 📂 Category Management

* Add, update, delete categories
* Organize products efficiently

---

### 🛒 Item Management

* Add new products with:

  * Name, price, category, description
  * Image upload (stored locally on server)
* View and delete items
* Inventory control system

---

### 🔍 Explore & Cart System

* Browse items with **search and filter**
* Add items to cart
* Modify quantities dynamically

---

### 💳 Billing & Payments

* Customer details form
* Payment methods:

  * Cash
  * UPI (Razorpay integration)
* Automatic calculation of:

  * Total amount
  * Tax
* Generates **order receipt**

---

### 📜 Order History

* View all previous orders
* Displays:

  * Customer details
  * Items purchased
  * Payment status
  * Date & time

---

### 📁 File Storage

* Product images stored in backend `/uploads` directory
* Only file paths stored in database

---

## 🏗️ Tech Stack

### Frontend

* ReactJS (Vite)
* Bootstrap
* Axios
* React Router

### Backend

* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA

### Database

* H2 Database (In-Memory)

---

## 📂 Project Structure

### Backend (Spring Boot)

```
com.pos.backend
 ├── controller
 ├── service
 ├── service.impl
 ├── repository
 ├── entity
 ├── dto
 ├── security
 ├── config
 └── util
```

### Frontend (React)

```
src/
 ├── components/
 ├── pages/
 ├── services/
 ├── utils/
 ├── App.jsx
 └── main.jsx
```

---

## ⚙️ Setup Instructions

### 🔧 Backend Setup (Spring Boot)

1. Open project in Spring Tool Suite (STS)
2. Configure `application.properties`:

```
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update

spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

3. Run the application
4. Backend runs on:

```
http://localhost:8080
```

---

### 💻 Frontend Setup (React)

```bash
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔗 API Endpoints

| Module      | Endpoint      | Method |
| ----------- | ------------- | ------ |
| Auth        | `/auth/login` | POST   |
| Category    | `/category`   | CRUD   |
| Item        | `/item`       | CRUD   |
| Orders      | `/order`      | POST   |
| Orders List | `/orders`     | GET    |
| Dashboard   | `/dashboard`  | GET    |

---

## 🔐 Default Admin Credentials

```
Email: admin@gmail.com
Password: admin123
```

---

## 📸 Screenshots

* Dashboard with analytics
* Item browsing & cart system
* Category & item management
* Order receipt & history

---

## ⚡ Key Highlights

* Full-stack architecture
* Secure authentication with JWT
* Clean UI with responsive design
* Real-time billing system
* Scalable and modular structure

---

## 🎯 Future Enhancements

* Cloud image storage (AWS S3)
* Multi-user roles & permissions
* Barcode scanning
* Invoice PDF download
* Deployment on cloud

---

## 👨‍💻 Author

Developed as a **full-stack project for learning, hackathons, and real-world retail use cases**.

---

## 📜 License

This project is open-source and free to use for educational purposes.

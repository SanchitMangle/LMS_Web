# 🎓 Full Stack Learning Management System (LMS) Website

A full-featured **Learning Management System (LMS)** built using the **MERN Stack**.  
This platform allows **educators** to publish courses online and **students** to enroll, purchase, and watch courses seamlessly.  

---

## 📖 Overview

This project includes features for both **educators** and **students**:

- 👨‍🏫 **Educators** can create and publish courses.
- 👩‍🎓 **Students** can register, enroll, and learn through structured courses.
- 🔐 **Authentication** is handled by [Clerk](https://clerk.com/) with prebuilt UI components.
- 💳 **Payments** are processed through **Stripe**, enabling students to purchase courses online.
- 📊 A scalable **MERN stack** implementation ensures smooth performance.

---

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Authentication:** Clerk (Sign-up, Sign-in, Profile management)  
**Payments:** Stripe Payment Gateway  
**Hosting:** Vercel (Backend), Vercel (Frontend)

---

## ✨ Features

### 👨‍🏫 Educators
- Publish and manage courses
- Add course details (title, description, videos, price)
- View student enrollments

### 👩‍🎓 Students
- Register and login using Clerk
- Browse and enroll in courses
- Make secure online payments using Stripe
- Access purchased courses anytime

### ⚙️ Platform
- Authentication & user management with Clerk’s ready-to-use components
- Stripe-powered secure payments
- Responsive design with Tailwind
- MERN stack scalability

---

## 🚀 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/SanchitMangle/LMS_Web.git
cd LMS_Web
# 🎓 Full Stack Learning Management System (LMS) Website

A full-featured **Learning Management System (LMS)** built using the **MERN Stack**.  
This platform allows **educators** to publish courses online and **students** to enroll, purchase, and watch courses seamlessly.  

Install dependencies

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
Setup environment variables

Create .env files for both backend and frontend.

Backend .env

PORT=5000
MONGO_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
CLERK_SECRET_KEY=your_clerk_secret_key
Frontend .env

VITE_BACKEND_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
Run the application

# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
.
├── backend/         # Express server, APIs, models
├── frontend/        # React application
├── screenshots/     # Project screenshots
├── README.md
└── ...
bash```

🌐 Live Demo
🔗 Live Site: https://lms-web-frontend.vercel.app/
💻 GitHub Repo: https://github.com/SanchitMangle/LMS_Web




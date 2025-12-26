# 🎓 Enterprise LMS Platform (2025 Standard)

A modern, production-ready **Learning Management System (LMS)** built with the **MERN Stack** and **TypeScript**.  
Re-engineered for scalability, accessibility, and a premium "Glass/Indigo" UI experience.

---

## 🚀 Key Enterprise Features

### For Students

- **Interactive Home Page**: Premium animations (Framer Motion), glassmorphism effects, and staggered grid layouts.
- **Detailed Course View**: Sticky purchase cards, course content preview with "Free/Paid" badges.
- **Learning Experience**: Video player, progress tracking, and seamless lesson navigation.
- **Dark Mode**: Fully supported native dark mode for eye comfort.

### For Educators

- **Workspace Dashboard**: **Skeleton Screens** for instant feedback, interactive Revenue Charts (Recharts), and enrollment stats.
- **Course Builder**: Modular "Add Course" flow with **Lecture & Quiz Management** (custom modal architecture).
- **Smart Experience**: Guided usage with "Smart Empty States" and validation.
- **Management**: Track enrollments, earnings, and course status.

### Platform & Tech

- **Authentication**: Clerk (Secure User Management).
- **Payments**: Stripe Integration.
- **Clean Architecture**: Decoupled UI and Business Logic.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Semantic Design Tokens)
- **Components**: Radix UI Primitives + Custom "Shadcn-like" Library
- **Motion**: Framer Motion (Page Transitions, Scroll Animations)
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js + Express + TypeScript
- **Database**: MongoDB + Mongoose
- **Security**: Helper middlewares, JWT verification (where Clerk isn't used).

---

## 📦 Architecture Highlights

This project follows a **Feature-Driven & Component-Based** architecture:

- `client/src/components/ui/`: Reusable primitives (Button, Card, Skeleton).
- `client/src/components/students/` & `educators/`: Domain-specific components.
- `client/src/pages/`: Route-based pages.
- `client/src/context/`: Global App State (Currency, Auth).

---

## 🚀 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/SanchitMangle/LMS_Web.git
   cd LMS_Web
   ```

2. **Install Dependencies**

   ```bash
   # Backend
   cd Server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

3. **Environment Setup**
   Create `.env` files in `Server` and `client` folders using the provided `.env.example` (or your keys).

   **Server/.env**

   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://...
   CLERK_SECRET_KEY=sk_...
   STRIPE_SECRET_KEY=sk_...
   ```

   **client/.env**

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_...
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. **Run the Application**

   ```bash
   # Terminal 1 (Backend)
   cd Server && npm run dev

   # Terminal 2 (Frontend)
   cd client && npm run dev
   ```

---

## 🎨 UI/UX Philosophy

- **Glassmorphism**: Subtle transparencies and blurs for depth.
- **Motion**: Purposeful animations to guide user attention (SlideUp, FadeIn).
- **Accessibility**: Semantic HTML, proper contrast (Light/Dark), and keyboard navigation.

---

## 📝 Recent Updates (Phase 8 & 9)

- **Enterprise Elevation**: Decoupled Forms, Skeleton Loading, Sidebar Refactor.
- **Theme Polish**: Full Dark Mode audit and implementation.

---

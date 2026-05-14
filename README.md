# 💰 Nexurah Finance

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnexurah-tech%2Fnexurah-account-maintanence)

Nexurah Finance is a premium, full-stack financial tracking application designed for startups and small business owners. Built with **Next.js 14**, it offers a seamless, mobile-first experience for managing incomes, expenses, and real-time financial analytics.

## ✨ Key Features

- **📊 Dynamic Dashboard**: Instantly view your Total Income, Total Outcome, and Available Balance. Filter stats by week, month, or all-time.
- **📋 Transaction Management**: Comprehensive list view with search, filtering by type, and month-wise grouping for better clarity.
- **📈 Advanced Analytics**: Pure CSS horizontal bar charts and performance tables providing weekly and monthly insights into your financial health.
- **📱 Mobile-First Design**: Fully responsive UI with a dedicated bottom navigation bar for mobile and a professional sidebar for desktop.
- **⚡ Optimized Backend**: Serverless API routes with cached MongoDB connections for maximum performance and low latency.
- **🔔 Real-time Feedback**: Instant notifications for successful transactions and error handling via `react-hot-toast`.

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS (v4)
- **Backend:** Next.js API Routes, Mongoose (MongoDB)
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Dates:** date-fns

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have Node.js 18+ and a MongoDB connection string.

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://nexurah_db_user:nexurah123@cluster0.jawbsdq.mongodb.net/accountMaintenance?retryWrites=true&w=majority&appName=Cluster0
```

### 4. Run Locally
```bash
npm run dev
```

### 5. Seed Data
Visit `http://localhost:3000/api/seed` to populate your database with the initial 13 startup transactions.

## 🚢 Deployment (Vercel)

1. **Push to GitHub:** Commit your code and push to your repository.
2. **Import to Vercel:** Select your repository on the Vercel dashboard.
3. **Environment Variables:** Add `MONGODB_URI` in the project settings.
4. **Deploy:** Vercel will automatically handle the build and deployment.

## 🎨 Design System

- **Primary Color:** `#174143` (Nexurah Teal)
- **Income Accent:** `#1D9E75` (Emerald Green)
- **Outcome Accent:** `#E24B4A` (Sunset Red)
- **Background:** `#F8FAFB` (Cloud Gray)

---

Developed with ❤️ by the Nexurah Team.

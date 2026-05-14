# Nexurah Finance

A premium, full-stack finance tracker built with Next.js 14, Tailwind CSS, and MongoDB.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** MongoDB via Mongoose
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Deployment:** Vercel

## Vercel Deployment Steps
1. **Push to GitHub:** Initialize a git repo and push your code.
2. **Create Project on Vercel:** Import your repository.
3. **Configure Environment Variables:**
   - Go to Project Settings -> Environment Variables.
   - Add `MONGODB_URI` with your connection string:
     `mongodb+srv://nexurah_db_user:nexurah123@cluster0.jawbsdq.mongodb.net/accountMaintenance?retryWrites=true&w=majority&appName=Cluster0`
4. **Deploy:** Hit deploy. Vercel will auto-detect Next.js settings.
5. **Seed Database:** After the first deployment, visit `https://your-app-url.vercel.app/api/seed` once to populate the initial 13 transactions.
6. **Done:** Your finance tracker is ready to use!

## Features
- **Dashboard:** Overview of total income, outcome, and balance.
- **Transactions:** Full searchable list with month-wise grouping and delete functionality.
- **Analytics:** Monthly and weekly performance charts using pure CSS.
- **Mobile First:** Optimized for mobile touch targets and responsiveness.
- **Real-time Updates:** Add transactions instantly with optimistic-style UI patterns.

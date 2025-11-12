# 🧮 401(k) Contribution Dashboard

This project is done with [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

It provides an interactive 401(k) contribution simulator with authentication, contribution tracking, and future savings projections — all using a simple local JSON database.

---

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
Then, run the development server:
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open http://localhost:3000 in your browser to see the dashboard.
## Project Overview
The 401(k) Dashboard allows users to:
- Sign up and log in locally
- View their current salary, age, and contribution plan
- Edit their status
- View current total YTD contributions
- See historical contribution changes
- Simulate new savings plans via the “Show Impact” panel

Data is stored locally in data/store.json and data/users.json using LowDB, providing a simple file-based database.

## Project Structure
```bash
src/
 ├─ app/
 │   ├─ api/
 │   │   ├─ auth/
 │   │   │   ├─ login/route.ts
 │   │   │   ├─ signup/route.ts
 │   │   │   └─ logout/route.ts
 │   │   ├─ contribution/route.ts
 │   │   └─ history/route.ts
 │   ├─ layout.tsx
 │   └─ page.tsx                # Main dashboard page
 │
 ├─ components/
 │   ├─ ContributionHistory.tsx
 │   ├─ ContributionImpact.tsx
 │   ├─ AuthModal.tsx
 │   └─ Shared UI components
 │
 ├─ data/
 │   ├─ users.json              # Stores user credentials and session tokens
 │   └─ store.json              # Stores contribution data and history
 │
 └─ lib/
     ├─ userDb.ts               # LowDB instance for user data
     └─ auth.ts                 # Token and password utilities
```

## License
MIT License © 2025
Developed for educational and demonstration purposes.

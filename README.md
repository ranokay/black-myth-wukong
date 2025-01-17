# Black Myth: Wukong Database

A web application that provides a comprehensive database of armors and weapons from the game Black Myth: Wukong. The project consists of a frontend built with Next.js and a backend powered by Bun and Elysia.

## 🛠️ Tech Stack

### Frontend

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Radix UI primitives

### Backend

- Bun runtime
- Elysia.js
- DrizzleORM
- PostgreSQL
- Cheerio for web scraping

## 💻 Getting Started

### Prerequisites

- Node.js 18+
- Bun runtime
- PostgreSQL database

### Environment Variables

#### Frontend (.env)

```bash
NEXT_PUBLIC_API_URL=<http://localhost:5001>
```

#### Backend (.env)

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=5001
FRONTEND_URL=<http://localhost:3000>
```

### Installation

1. Clone the repository

```bash
git clone <https://github.com/ranokay/black-myth-wukong.git>
cd black-myth-wukong
```

2.Install frontend dependencies

```bash
cd frontend
bun install
```

3.Install backend dependencies

```bash
cd backend
bun install
```

4.Set up the database

```bash
cd backend
bun run generate
bun run migrate
```

5.Run the scraper to populate the database

```bash
bun run scraper
```

### Development

1. Start the backend server

```bash
cd backend
bun run api
```

2.Start the frontend development server

```bash
cd frontend
bun run dev
```

## 🔄 Data Updates

The scraper can be run manually to update the database with the latest information from the wiki:

```bash
cd backend
bun run scraper
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the environment variables
3. Deploy using the Vercel dashboard

### Backend (Railway)

1. Create a new project in Railway
2. Add a PostgreSQL database
3. Connect your GitHub repository
4. Set the environment variables
5. Deploy using the Railway dashboard

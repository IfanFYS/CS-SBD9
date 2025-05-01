# SBD Project

Full stack application built with React frontend and Express backend.

## Structure

- `/frontend-modul9` - React frontend built with Vite
- `/backend-modul56` - Express backend with PostgreSQL database

## Deployment

- Frontend: Deployed on Vercel
- Backend: Deployed on Render
- Database: PostgreSQL hosted on Neon

## Local Development

### Frontend

```bash
cd frontend-modul9
npm install
npm run dev
```

### Backend

```bash
cd backend-modul56
npm install
npm run dev
```

### Environment Variables

Make sure to set up your environment variables:

- Backend: Create a `.env` file in the backend-modul56 folder based on `.env.example`
- Frontend: Create a `.env` file in the frontend-modul9 folder with `VITE_API_URL` pointing to your backend
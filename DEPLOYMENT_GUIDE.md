# Vercel Deployment Guide for eversoulca

This project deploys a Vite React frontend and ASP.NET Core backend API using Vercel.

## Directory Structure
- `frontend/`: Vite React app
- `backend/UserApi/`: ASP.NET Core API

## Vercel Configuration
- `vercel.json` in `eversoulca` configures builds and routes:
  - Frontend is built and served from `frontend/dist`
  - Backend is deployed as a Vercel Serverless Function
  - API requests are routed to the backend

## Steps

1. **Frontend Build**
   - Vercel runs `vite build` (already set in `package.json`).
   - Output is served from `frontend/dist`.

2. **Backend API**
   - Vercel uses `@vercel/dotnet` to deploy ASP.NET Core API.
   - API requests are routed to `/api/*`.

3. **Routing**
   - All `/api/*` requests go to backend.
   - All other requests go to frontend.

## Example `vercel.json`
```
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/dist"
      }
    },
    {
      "src": "backend/UserApi/Program.cs",
      "use": "@vercel/dotnet"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/UserApi/$1"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ]
}
```

## Notes
- Make sure your backend does not use HTTPS redirection (Vercel handles HTTPS).
- If you need environment variables, set them in Vercel dashboard.
- For local development, run frontend and backend separately.

## Deploy
1. Push your code to GitHub.
2. Connect your repo to Vercel.
3. Deploy!

---
For advanced configuration, see [Vercel docs](https://vercel.com/docs).

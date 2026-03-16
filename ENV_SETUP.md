# Environment Configuration Guide

This guide explains how the frontend and backend handle API URL configuration for local development vs production deployment on Azure.

## Problem Solved

The frontend was making hardcoded API calls to `http://localhost:5266`, which failed when deployed to Azure because:
- Local dev: API is at `http://localhost:5266`
- Azure production: API is served from the same domain (no separate server)

## Solution: Environment-Based Configuration

### Frontend Configuration

The frontend uses Vite's environment variable system to switch API URLs based on the deployment environment.

#### Files Created/Modified

**`.env.local`** (Development - not committed)
```env
VITE_API_URL=http://localhost:5266
```

**`.env.production`** (Production - committed)
```env
VITE_API_URL=/api
```

Usage in React components:
```tsx
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5266';
const response = await fetch(`${apiUrl}/api/auth/login`, {...});
```

⚠️ **Important**: `.local` files are gitignored to prevent committing local dev config.

#### Updated Components

API calls have been updated in:
- `frontend/src/app/components/LoginPage.tsx`
- `frontend/src/app/components/SignupPage.tsx`
- `frontend/src/app/components/Header.tsx`

### Backend Configuration

The backend CORS policy now supports:
- **Development**: `http://localhost:5173` (Vite dev server) and `http://localhost:5266` (API server)
- **Production**: Same origin on Azure App Service (frontend served from `/` at same domain as `/api/*`)

No additional configuration needed—the backend serves the frontend static files from `wwwroot/`.

## How It Works

### Local Development

1. **Start frontend** (in separate terminal):
   ```bash
   cd frontend && pnpm dev
   ```
   - Runs on `http://localhost:5173`
   - Reads from `.env.local` → API URL = `http://localhost:5266`

2. **Start backend**:
   ```bash
   dotnet run --project backend/UserApi
   ```
   - Runs on `http://localhost:5266`
   - Serves API at `/api/*`
   - CORS allows requests from `localhost:5173`

### Production Deployment (Azure)

1. **GitHub Actions workflow**:
   - Builds frontend with `.env.production` → API URL = `/api` (relative)
   - Copies `frontend/dist/` to `backend/UserApi/wwwroot/`
   - Builds and publishes the backend

2. **Azure App Service**:
   - Serves frontend from `/` (static files in `wwwroot`)
   - Serves backend at `/api/*`
   - Frontend API calls go to `/api` on same domain (no CORS needed)

## Build Behavior

### Local Build
```bash
cd frontend
VITE_API_URL=http://localhost:5266 pnpm build
```
→ API URLs will use `http://localhost:5266`

### Production Build (CI/CD)
```bash
# GitHub Actions uses .env.production automatically
pnpm build
```
→ API URLs will use `/api` (relative path)

## Testing

### Local Dev Testing
1. Run frontend on `http://localhost:5173`
2. Run backend on `http://localhost:5266`
3. Login should work (frontend calls `http://localhost:5266/api/auth/login`)

### Production Testing (simulate with serve)
```bash
cd frontend
pnpm build
# The dist folder will have all URLs pointing to /api
pnpm preview
```

## Environment Variables Reference

| Variable | Local Dev | Production | Purpose |
|----------|-----------|------------|---------|
| `VITE_API_URL` | `http://localhost:5266` | `/api` | Base URL for all API calls |

## Troubleshooting

### "Failed to load from /api..."
- Check backend is running
- Verify CORS is configured in `Program.cs`
- Check that backend is actually serving static files

### "TypeError: Cannot read property of undefined" with API URLs
- Ensure `.env.production` exists in frontend directory
- Check that `vite.config.ts` includes the `define` configuration

### Frontend stuck on "Signing in..."
- Check browser console for network errors
- Verify API URL in `.env.production` or `.env.local`
- Ensure backend is running and accessible

## Next Steps

1. Update your Azure App Service origin in CORS if needed:
   ```csharp
   "https://yourapp.azurewebsites.net",
   ```

2. For custom domain:
   ```csharp
   "https://yourdomain.com",
   ```

3. Always test locally before pushing to Azure:
   - Run frontend dev server
   - Run backend locally
   - Test login/signup flows

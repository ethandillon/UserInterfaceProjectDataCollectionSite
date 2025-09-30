# Deployment Guide

## Vercel Deployment

### Step 1: Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Import the project in Vercel dashboard
3. Vercel will automatically detect it's a Vite project

### Step 2: Set Environment Variables in Vercel Dashboard
Go to your project settings in Vercel and add these environment variables:

#### Required Environment Variables:
```
VITE_TMDB_API_KEY = eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NmQ3OGVkOTVlMzBlNmRjOGNkMDk2MmYzZTAzNGZjZSIsIm5iZiI6MTc0NTk0MjQ4Mi41MzIsInN1YiI6IjY4MTBmN2QyZGRlNmUxODBmNjgxMmUxOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nd9icHFVzZWA-pA7dFYZzWlDgImjbJ703iIccIK54hQ

VITE_TMDB_BASE_URL = https://api.themoviedb.org/3

VITE_SHEET_BEST_ENDPOINT = https://api.sheetbest.com/sheets/637f56bf-d843-40d0-8b9c-6d4f1e40e10a

VITE_APP_NAME = Movie Recommender A/B Test
```

### Step 3: Set Environment for All Environments
Make sure to set these variables for:
- Production
- Preview 
- Development

### Step 4: Redeploy
After setting the environment variables, trigger a new deployment.

## Netlify Deployment (Alternative)

### Step 1: Connect Repository
1. Go to Netlify dashboard
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Step 2: Set Environment Variables
In Netlify site settings, add the same environment variables as above.

## Vercel CLI Method (Alternative)

If you prefer using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables via CLI
vercel env add VITE_TMDB_API_KEY production
vercel env add VITE_TMDB_BASE_URL production
vercel env add VITE_SHEET_BEST_ENDPOINT production
vercel env add VITE_APP_NAME production

# Redeploy
vercel --prod
```

## Troubleshooting

### Common Issues:
1. **Environment variables not working**: Make sure they start with `VITE_` prefix
2. **Build failing**: Check that all dependencies are in `package.json`
3. **API calls failing**: Verify environment variables are set correctly
4. **Routes not working**: Ensure `vercel.json` has the correct route configuration

### Testing Deployment:
1. Check that the form submission works
2. Verify movie loading from TMDB API
3. Test Google Sheets logging
4. Confirm A/B test group assignment works
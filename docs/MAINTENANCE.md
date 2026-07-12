# Maintenance & Deployment Guide

This document outlines best practices for maintaining the School Research Hub and deploying it to production.

## 1. Local Development Maintenance

### Updating Dependencies
Regularly update dependencies to ensure security and performance:
```bash
npm update
```
If using Tailwind CSS v4, ensure you check their official migration guides if updating to a newer major version in the future.

### Adding New Features
- **UI Components**: Place new reusable UI elements in `src/components/`. Use Lucide React for consistent iconography.
- **Views/Pages**: If adding routing (e.g., via `react-router-dom`), place full-page layouts in the `src/views/` directory.
- **State Management**: Complex global states (like the offline storage) should be managed via custom hooks in `src/hooks/`.

## 2. Database Maintenance (Supabase)

### Schema Changes
If you need to add new columns or tables:
1. Update the `supabase_schema.sql` file in the repository to keep a version-controlled record of your schema.
2. Apply the changes in your Supabase dashboard via the SQL Editor or using the Supabase CLI migrations.

### Data Backups
Supabase handles automated backups on Pro plans, but it is highly recommended to periodically export your critical `papers` data via the Supabase dashboard (CSV export) for redundancy.

## 3. Deployment

The application is built using Vite, making it extremely easy to deploy to static hosting platforms.

### Vercel (Recommended)
Vercel provides seamless deployment for Vite/React applications.
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Configure Environment Variables in the Vercel dashboard (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Click **Deploy**. Vercel will automatically use `npm run build` and serve the `dist` folder.

### Netlify
1. Import the GitHub repository into Netlify.
2. Set Build Command to `npm run build`.
3. Set Publish Directory to `dist`.
4. Add your Environment Variables.
5. Deploy.

## 4. Performance Monitoring
Ensure the site maintains its "premium" feel by auditing it with Google Lighthouse (available in Chrome DevTools) to check accessibility, SEO, and performance scores.

import { createClient } from '@supabase/supabase-js'

// ── Supabase Configuration ──────────────────────────────────────────────────
// Replace these with your actual Supabase project URL and anon key.
// You can find them in: Supabase Dashboard > Project Settings > API
//
// For production, move these to a .env file:
//   VITE_SUPABASE_URL=your_project_url
//   VITE_SUPABASE_ANON_KEY=your_anon_key
//
// Then reference them as:
//   import.meta.env.VITE_SUPABASE_URL
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// ────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Storage Bucket ──────────────────────────────────────────────────────────
// Bucket name in Supabase Storage where PDFs are stored.
// Create this bucket in: Supabase Dashboard > Storage > New Bucket
// Set it to PUBLIC so PDF links work without authentication.
// ────────────────────────────────────────────────────────────────────────────
export const PDF_BUCKET = 'research-papers'

// ── Helper: Get public PDF URL from storage ─────────────────────────────────
export function getPdfUrl(filePath) {
  if (!filePath) return null
  // If it's already a full URL (Google Drive or external), return as-is
  if (filePath.startsWith('http')) return filePath
  // Otherwise resolve from Supabase Storage
  const { data } = supabase.storage.from(PDF_BUCKET).getPublicUrl(filePath)
  return data?.publicUrl ?? null
}

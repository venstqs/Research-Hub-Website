-- ═══════════════════════════════════════════════════════════════════
--  Research Hub — Supabase Schema
--  Run this in: Supabase Dashboard > SQL Editor > New Query
-- ═══════════════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Papers table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS papers (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  authors      TEXT[]      NOT NULL DEFAULT '{}',
  abstract     TEXT,
  keywords     TEXT[]      DEFAULT '{}',

  -- Classification
  category     TEXT        NOT NULL
    CHECK (category IN ('Life Science', 'Physical Science', 'Robotics', 'Mathematics')),
  program      TEXT        NOT NULL
    CHECK (program IN ('STE', 'STEM')),

  year         SMALLINT,
  award        TEXT,           -- e.g. "National Gold Medalist" or NULL

  -- Storage: path inside Supabase Storage bucket OR full external URL (Google Drive)
  pdf_url      TEXT,

  -- Discovery
  is_trending  BOOLEAN     NOT NULL DEFAULT false,
  views        INTEGER     NOT NULL DEFAULT 0,

  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ─────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS papers_category_idx    ON papers (category);
CREATE INDEX IF NOT EXISTS papers_program_idx     ON papers (program);
CREATE INDEX IF NOT EXISTS papers_year_idx        ON papers (year);
CREATE INDEX IF NOT EXISTS papers_trending_idx    ON papers (is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS papers_views_idx       ON papers (views DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS papers_fts_idx ON papers
  USING GIN (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(abstract,'')));

-- ── Auto-update updated_at ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS papers_updated_at ON papers;
CREATE TRIGGER papers_updated_at
  BEFORE UPDATE ON papers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── View increment RPC ───────────────────────────────────────────────
-- Called by the frontend when a user opens a paper detail modal.
CREATE OR REPLACE FUNCTION increment_views(paper_id UUID)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE papers SET views = views + 1 WHERE id = paper_id;
$$;

-- ── Row Level Security (RLS) ─────────────────────────────────────────
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anon key)
CREATE POLICY "Public can read papers"
  ON papers FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated (admin) users can insert/update/delete
CREATE POLICY "Authenticated can manage papers"
  ON papers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════
--  Storage Bucket Setup
--  Do this in: Supabase Dashboard > Storage > New Bucket
-- ═══════════════════════════════════════════════════════════════════
-- Bucket name: research-papers
-- Access:      Public (so PDF links work without authentication)
-- Allowed MIME types: application/pdf
-- Max file size: 50MB (recommended)
--
-- Storage RLS policies (run after creating bucket):

INSERT INTO storage.buckets (id, name, public) VALUES ('research-papers', 'research-papers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view PDFs"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'research-papers');

CREATE POLICY "Authenticated can upload PDFs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'research-papers');

CREATE POLICY "Authenticated can delete PDFs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'research-papers');

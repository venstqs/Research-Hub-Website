import { papersDatabase } from '../data/papersDatabase'

// ── Category constants ──────────────────────────────────────────────────────
export const CATEGORIES = {
  LIFE_SCIENCE: 'Life Science',
  PHYSICAL_SCIENCE: 'Physical Science',
  ROBOTICS: 'Robotics',
  MATHEMATICS: 'Mathematics',
}

export const PROGRAMS = {
  STE: 'STE',
  STEM: 'STEM',
}

// Helper function to simulate network delay for smooth UI skeleton loaders
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// ── Fetch all papers (Google Drive Database Wrapper) ─────────────────────────
export async function fetchPapers({ category, program, search, limit = 50, offset = 0 } = {}) {
  await delay(400) // Mock loading state duration

  let data = [...papersDatabase]

  if (category && category !== 'All') {
    data = data.filter(p => p.category === category)
  }

  if (program && program !== 'All') {
    data = data.filter(p => p.program === program)
  }

  if (search && search.trim()) {
    const term = search.trim().toLowerCase()
    data = data.filter(p => 
      p.title.toLowerCase().includes(term) ||
      p.abstract.toLowerCase().includes(term) ||
      p.keywords.some(k => k.toLowerCase().includes(term))
    )
  }

  return data.slice(offset, offset + limit)
}

// ── Fetch a single paper by ID ───────────────────────────────────────────────
export async function fetchPaperById(id) {
  await delay(100)
  const paper = papersDatabase.find(p => p.id === id)
  if (!paper) throw new Error('Paper not found')
  return paper
}

// ── Fetch trending papers ────────────────────────────────────────────────────
export async function fetchTrending(limit = 6) {
  await delay(300)
  return [...papersDatabase]
    .filter(p => p.is_trending)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}

// ── Fetch award-winning papers ───────────────────────────────────────────────
export async function fetchAwardWinners(limit = 8) {
  await delay(300)
  return [...papersDatabase]
    .filter(p => p.award !== null && p.award !== undefined)
    .slice(0, limit)
}

// ── Fetch papers by category ─────────────────────────────────────────────────
export async function fetchByCategory(category, limit = 10) {
  await delay(350)
  return [...papersDatabase]
    .filter(p => p.category === category)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}

// ── Fetch stats (counts per category/program) ────────────────────────────────
export async function fetchStats() {
  await delay(200)
  const total = papersDatabase.length
  const ste = papersDatabase.filter(p => p.program === 'STE').length
  const stem = papersDatabase.filter(p => p.program === 'STEM').length
  const awards = papersDatabase.filter(p => p.award !== null).length

  return {
    total,
    ste,
    stem,
    awards
  }
}

// ── Increment view count ─────────────────────────────────────────────────────
export async function incrementViews(paperId) {
  // In GDrive mode, local state views increment simulated
  const paper = papersDatabase.find(p => p.id === paperId)
  if (paper) {
    paper.views += 1
  }
}

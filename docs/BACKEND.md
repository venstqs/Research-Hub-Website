# Backend Integration Guide (Supabase)

The School Research Hub utilizes [Supabase](https://supabase.com/) as its backend-as-a-service (BaaS) to provide a scalable PostgreSQL database and API layer.

## Database Schema

The core database structure is defined in `supabase_schema.sql` at the root of the project. 

### Key Tables (Typical Structure):
- **`papers`**: Stores the metadata for each research paper.
  - `id` (UUID, Primary Key)
  - `title` (Text)
  - `abstract` (Text)
  - `strand` (Text)
  - `year` (Integer)
  - `award` (Text, nullable)
  - `pdf_url` (Text)
  - `is_trending` (Boolean)
  - `is_gold` (Boolean)
- **`authors`**: Links authors to specific papers.
- **`keywords`**: Categorization tags for papers.

## Connecting the Frontend

The React frontend communicates with Supabase using the `@supabase/supabase-js` client library. The connection is initialized in `src/lib/api.js`.

### Configuration
You must configure your local environment variables before the frontend can communicate with the backend. Create a `.env.local` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Data Fetching (`src/lib/api.js`)
The `api.js` file handles all asynchronous calls to the Supabase backend. Typical functions include:
- `fetchPapers()`: Retrieves the list of papers, optionally filtered by strand or search query.
- `fetchPaperById(id)`: Retrieves details for a specific paper.

## Transitioning from Mock Data to Live Data
During initial development, the application may use data from `src/data/mockPapers.js`. To transition to the live backend:
1. Ensure the Supabase tables are seeded with data according to `supabase_schema.sql`.
2. Update the `App.jsx` (or respective Views) to call `fetchPapers()` from `api.js` inside a `useEffect` hook instead of importing the static `mockPapers` array.
3. Handle loading states while the data is being retrieved.
